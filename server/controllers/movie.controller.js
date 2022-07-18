const mySQL = require('../config/db/dbMysql');


// [GET]/movie/
/*
@params none
@return trả về danh sách phim giới hạn 10 bộ theo lượt xem 
*/
class movieController {
    movieList(req, res, next) {
        mySQL.query(
            `SELECT * FROM webmovie.movies
            where phim_hot = '1';`,
            function(err, results ) {
              if (err) {
                res.status(500).json({
                    messager: err,
                })
              }
              else {
                res.status(202).json({
                    list_movie: results,
                })
              }
            }
          );
    }
}

module.exports = new movieController();