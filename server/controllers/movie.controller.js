const { get } = require('mongoose');
const mySQL = require('../config/db/dbMysql');

class movieController {

  // [GET]/movie/
/*
@params none
@return trả về danh sách phim giới hạn 10 bộ theo lượt xem 
*/
    movieList(req, res, next) {
        mySQL.query(
            `select * from webmovie.movies 
            where id in 
            (select movie_id from
            (select movie_id, sum(views) as totalview
            from webmovie.episodes
            group by movie_id
            order by totalview desc
            limit 10) temp);`,
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



    /*
    @param watched: đã xem, episode: tập phim, movie_id: id của phim
    @return sau khi update lượt xem xong thì gửi message thành công và số lần xem mỗi tập
    */
    //[GET]/movie/update_views
    updateViews(req, res, next) {
      const { watched, episode, movie_id } = req.body;
      mySQL.query(`SELECT webmovie.episodes.views 
      FROM webmovie.episodes
      inner join webmovie.movies on webmovie.episodes.movie_id = webmovie.movies.id 
      where webmovie.episodes.episode = ${episode} and webmovie.episodes.movie_id = ${movie_id}
      limit 1 ;`, (err, result) => {
        if (err) {
          console.log(err);
        }

        if (result.at(0) != null) {
          var views = result.at(0).views;
        if (watched) {
          views++;
        }

        mySQL.query(`UPDATE webmovie.episodes SET views = ${views} WHERE (movie_id = ${movie_id});`);
        res.status(201).json({
          messager: 'update views successfully',
          views: views,
        })
        } else {
          res.status(202).json({
            messager: 'No results were found',
          })
        }
        
      });
        
    }

}

module.exports = new movieController();