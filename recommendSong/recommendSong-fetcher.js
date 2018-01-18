const https = require("https");

const factory = (https)=> {
    return (artist, callbacks)=> {
        const defaultCallbacks = {
            onFetch: (cdname, url)=> console.log("Callback:onFetch is not specified."),
            onNotFetch: ()=> console.log("Callback:onNotFetch is not specified.")
        };
        
        const mergedCallbacks = Object.assign({}, defaultCallbacks, callbacks);
        
        const targetUrl = "https://rss.itunes.apple.com/api/v1/jp/itunes-music/top-songs/all/50/explicit.json";
                
        https.get(targetUrl, (res)=>{
            let body = '';
            res.setEncoding('utf8');
            
            res.on('data', (chunk)=> {
                body += chunk;
            });
            
            res.on('end', (res)=> {
                const result = JSON.parse(body);
                //console.log(result);
                
                if(result.count === 0){
                    const resultText = "not find artist";
                    const resultUrl = "";
                    
                    mergedCallbacks.onFetch(resultText, resultUrl);
                }else{
                    var resultartistName =[];
                    var resulttrackName = [];
                    var resultpreviewUrl = [];        
                    
                    result.feed.results.forEach(function(song){
                        resultartistName.push(song.artistName);
                        resulttrackName.push(song.name);
                        resultpreviewUrl.push(song.url);
                    });
                    
                    const resultAgregate = agregate(result.feed.results);
                    
                    //console.log(resultartistName);
                    //console.log(resulttrackName);
                    //console.log(resultpreviewUrl);
                    mergedCallbacks.onFetch(resultartistName, resulttrackName,resultpreviewUrl, resultAgregate);
                }
            });
        }).on("error", (e)=> {
            console.log(e);
            mergedCallbacks.onNotFetch();
        });
    };
};


const agregate =(songs) => {
    var agregateGenres = {} ;
    songs.forEach(function(song){
       song.genres.forEach(function(genre){
          const genreName=genre.name;
          ///console.log("aaa "+ID);
          if(!agregateGenres[genreName]){
              agregateGenres[genreName] = 1;
          }
          else{
              agregateGenres[genreName] = agregateGenres[genreName] + 1;
          }
       });
    });
    //console.log(r);
    // agregateGenres.sort(function(a,b){
    //     if( a > b ) return -1;
    //     if( a < b ) return 1;
    //     return 0;
    // });
    var MaxGenreCount = 0;
    let MaxGenreName = "";
    console.log(agregateGenres);
        //ここ！！ジャンルランキングだよ！
        //よろしく(^^)
     for(let key in agregateGenres){
        if(key === 'ミュージック');
        else{
            if(MaxGenreCount < agregateGenres[key]){
                MaxGenreCount = agregateGenres[key];
                MaxGenreName = key;
            }
        }
    }
    return "上位50曲のジャンルランキングは。。。！！\n\n\n"+ MaxGenreName + "最高！";
}

exports.factory = factory;
exports.fetch = factory(https);