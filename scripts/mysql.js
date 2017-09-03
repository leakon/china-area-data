'use strict'

const fs = require('fs')
const path = require('path')
const getPath = function (dir) {
  return path.join(__dirname, dir)
}


build(3)

function build (version) {
  const datas = fs.readFileSync(getPath(`../v${version}/data.json`), 'utf-8')
  const data = JSON.parse(datas)

  var tpl = "INSERT INTO data_region SET code = _AID_, parent = _PID_, level = _LEVEL_,  name = '_NAME_';";

var sql = '';

  function build_sqls(pid, level, arr) {

      for (var idx in arr) {
          build_sql(pid, level, idx, arr[idx]);
      }


  }

  function build_sql(pid, level, aid, name) {

      sql = tpl;

      sql = sql.replace('_PID_', pid);
      sql = sql.replace('_LEVEL_', level);
      sql = sql.replace('_AID_', aid);
      sql = sql.replace('_NAME_', name);


    //   console.log(sql);


  }





  var level = 0;
  var list;
  var pid = 0, aid = 0;

  var provinces = {};
  var cities = {};
  var districts = {};

  var map = {
      province: {},
      city: {},
      district: {}
  };


    //   provinces = data['86'];
        //   level = 1


  for (pid in data) {

  //   list = data[pid];
  //
  // if (pid == '86') {
  //   level = 0;
  //     build_sqls(pid, level, provinces);
  //     continue;
  // }


   // for (aid in data[pid]) {

   // console.log(pid);

      if (provinces[pid]) {
          level = 2
          cities = data[pid];
        //   console.log(cities);break;

          map.city[pid] = cities;

          build_sqls(pid, level, cities);

        //   break;
      } else if (cities[pid]) {
          level = 3
          districts = data[pid];

          map.district[pid] = districts;

          build_sqls(pid, level, districts);
        //   break;

        } else {
          provinces = data[pid];

          map.province = provinces;
              level = 1
      build_sqls(0, level, provinces);

        }


  }


  require('fs').writeFileSync(getPath('../map.json'), JSON.stringify(map, null, 2));



}
