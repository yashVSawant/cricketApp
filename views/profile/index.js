const host = 'http://localhost:3333';
const token = localStorage.getItem('token');
const back = document.getElementById('back');

window.addEventListener('DOMContentLoaded',async()=>{


    const data = await axios.get(`${host}/user/api/data`,{headers:{'Authorization':token}});
    const playerData = data.data.data;
    // console.log(playerData , data)
    display(data.data.name ,playerData.playerType ,playerData.matches ,playerData.runs ,playerData.wickets,playerData.fours,playerData.sixes,playerData.highestScore,playerData.highestWickets,playerData.balls,playerData.overs);
});

back.onclick = ()=>{
    window.location.href = '../home/index.html';
}

function display(plName ,plPlayerType ,plMatches ,plRuns ,plWickets,plFours,plSixes,plhighestScore,plhighestWickets,plBalls,plOvers){
    const name = document.getElementById('name');
    const playerType = document.getElementById('playerType');
    const matches = document.getElementById('matches');
    const runs =  document.getElementById('runs');
    const highestScore = document.getElementById('highestScore');
    const fours = document.getElementById('fours');
    const sixes = document.getElementById('sixes');
    const balls = document.getElementById('balls');
    const wickets = document.getElementById('wickets');
    const highestWickets = document.getElementById('highestWickets');
    const overs = document.getElementById('overs');

    name.innerText = plName;
    playerType.innerText = plPlayerType;
    matches.innerText = plMatches;
    runs.innerText = plRuns;
    highestScore.innerText = plhighestScore;
    fours.innerText = plFours;
    sixes.innerText = plSixes;
    balls.innerText = plBalls;
    wickets.innerText = plWickets;
    highestWickets.innerText = plhighestWickets;
    overs.innerText = plOvers;

}

