const host = 'http://localhost:3333';
const token = localStorage.getItem('token');
const back = document.getElementById('back');

window.addEventListener('DOMContentLoaded',async()=>{


    const data = await axios.get(`${host}/user/api/data`,{headers:{'Authorization':token}});
    const playerData = data.data.data;
    // console.log(playerData , data)
    display(data.data.name ,playerData.playerType ,playerData.matches ,playerData.runs ,playerData.wickets);
});

back.onclick = ()=>{
    window.location.href = '../home/index.html';
}

function display(plName ,plPlayerType ,plMatches ,plRuns ,plWickets){
    const name = document.getElementById('name');
    const playerType = document.getElementById('playerType');
    const matches = document.getElementById('matches');
    const runs =  document.getElementById('runs');
    const wickets = document.getElementById('wickets');

    name.innerText = plName;
    playerType.innerText = plPlayerType;
    matches.innerText = plMatches;
    runs.innerText = plRuns;
    wickets.innerText = plWickets;

}

