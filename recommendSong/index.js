const moji = require("moji");
const recommendSongfetcher = require('./recommendSong-fetcher');

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log(event);
    //const findDetectedWord = (event)=>{
    if(!event.analysedMessage){
        console.log("何もしてない")
        return;
    }
    if(event.analysedMessage.sentences.length === 0){
        console.log("0だと判定された")
        return;
    }
     console.log("bbb");
    const detectedWords = event.analysedMessage.sentences.map((sentence)=>{
        const content = moji(sentence.text.content).convert('ZE', 'HE').toString();
        //console.log(content);
        const indexOfKeyword = content.indexOf("CDランキング");
        console.log(indexOfKeyword);
        if(indexOfKeyword < 0){
            return null;
            
        }else{
            recommendSongfetcher.fetch("", {
                    onFetch: (artistName, trackName,previewUrl, Agregate)=>{
                        var result ="";
                        for(var i = 0; i<3; i++){
                            result += artistName[i] + '/' + trackName[i] + ':' + previewUrl[i] + '\n\n\n' ;
                        };
                        result += Agregate;
                        callback(null,{message:result});
                    },
                    onNotFetch:()=>callback()
                });
        //    callback(null,{message:"これだよ"});
    //        return content.substring((indexOfKeyword+5), content.length);
        }
    }).filter(val=> val !== null);
    
    console.log(detectedWords);
    if(detectedWords.length === 0){
        return;
    }else{
        return detectedWords[0];
    }
//};
    
    callback();
};