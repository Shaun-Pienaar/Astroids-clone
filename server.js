const express = require ('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

let astroidGameHighscores = [];

//Set up game highscores
for(let i = 5; i > 0; i--){
  let scoreObj = {name:'No Name',score:i*100};
  astroidGameHighscores.push(scoreObj);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'classes')));
app.use(express.static(path.join(__dirname, 'p5')));
app.use(express.static(path.join(__dirname, 'sounds')));
app.use(express.static(path.join(__dirname, 'sprites')));

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/highscores', (req, res) => {
    res.json(astroidGameHighscores);
});
app.post('/highscores', (req, res) => {
    let newScoresList = req.body;
    if(!(newScoresList instanceof Array)){
        res.json({msg:'Invalid request. Please check the url.'});
    }
    else{
        for(let i = 0; i < newScoresList.length; i++){
            if(!scoreExists(newScoresList[i])){
                addHighscore(newScoresList[i].name, newScoresList[i].score);
            }
        }
        res.json({msg:'Successfully updated highscores'});
    }
});

app.listen(port, () => console.log(`Listening on port:${port}!`));

function addHighscore(name, score){
    //If score to add is less than lowest score in existing highscores just return
    if(score <= astroidGameHighscores[astroidGameHighscores.length-1].score){
        return;
    }
    for(let i = 0; i < astroidGameHighscores.length; i++){
        //Else compare score to each astroidGameHighscore, add to appropriate
        //place and remove bottom score from old highscores.
        if(score > astroidGameHighscores[i].score){
            let obj = {name:name, score:score};
            astroidGameHighscores.splice(i, 0, obj);
            astroidGameHighscores.pop();
            break;
        }
    }
}

//Function to check if a score already exists in highscores
function scoreExists(scoreObj){
    for(let i = 0; i < astroidGameHighscores.length; i++){
        if(scoreObj.name === astroidGameHighscores[i].name && scoreObj.score === astroidGameHighscores[i].score){
            return true;
        }
    }
    return false;
}