const socket = io();
const token = localStorage.getItem('token');

const batterArray = [];
const bowlerArray = [];

window.addEventListener('DOMContentLoaded',async()=>{
    const tournamentId = (localStorage.getItem('tournamentId'))
    // console.log(tournamentId);
    const matchData = await axios.get(`/match/api/getMatch/${tournamentId}`,{headers:{'authorization':token}});
    const team1Id = matchData.data.match.team1Id;
    const team2Id = matchData.data.match.team2Id;
    const matchId = matchData.data.match.id;
    let id = team1Id;
    const team1Data = await axios.get(`/team/api/${id}/players`,{headers:{'authorization':token}});
    id = team2Id
    const team2Data = await axios.get(`/team/api/${id}/players`,{headers:{'authorization':token}});
    const battersData = await axios.get(`/match/api/${matchId}/batter/updates`,{headers:{'authorization':token}});
    const bowlersData = await axios.get(`/match/api/${matchId}/bowler/updates`,{headers:{'authorization':token}});
    
    const update = matchData.data.match;
    console.log(update);
    displayTeamName(team1Data.data.team.name,team2Data.data.team.name,matchData.data.match.overs);
    displayScore(1,update.team1Runs,update.team1Wickets,update.team1Overs,update.team1Balls);
    displayScore(2,update.team2Runs,update.team2Wickets,update.team2Overs,update.team2Balls);
    team1Data.data.players.forEach((p)=>{
        showPlayer(1,p.id ,p.name)
    })
    team2Data.data.players.forEach((p)=>{
        showPlayer(2,p.id ,p.name)
    })
    console.log(battersData.data.batters,bowlersData.data.bowler)
    battersData.data.batters.forEach((p)=>{
        const row = document.getElementById(`${p.userId}`);
        const name = document.getElementById(`batterName${p.userId}`).innerText
        const inning = row.class;
        console.log(inning);
        console.log(p,p.userId ,inning,p.runs,p.sixes,p.fours,p.balls,name,p.state)
        displayBatterStats(p.userId ,inning,p.runs,p.sixes,p.fours,p.balls,name,p.state);
        row.parentNode.removeChild(row);
    })
    bowlersData.data.bowler.forEach((p)=>{
        const row = document.getElementById(p.userId);
        const name = document.getElementById(`batterName${p.userId}`).innerText
        const inning = row.class;
        console.log(inning)
        if(inning == 1)displayBowlerStats(p.userId ,2,p.runs,p.wickets ,p.overs,name);
        else displayBowlerStats(p.userId ,1,p.runs,p.wickets ,p.overs,name);
        console.log(p.id ,1,p.runs,p.wickets ,p.overs,name)
    })
    socket.emit('watch-score',tournamentId);
    // socket.emit('updates',tournamentId);
})

socket.on('batter',( id ,inning,runs ,sixes ,fours ,balls)=>{
    console.log( id ,inning,runs ,sixes ,fours ,balls);
    updateBatterStats(id ,inning,runs ,sixes ,fours ,balls)
})

socket.on('bowler',( id ,inning,over,runs)=>{
    console.log( id ,inning,over,runs);
    updateBowlerStats(id ,inning,over,runs)
})

socket.on('wicket',( id ,inning,wickets,type)=>{
    console.log( id ,inning,wickets)
    updateBowlerWickets(id ,inning,wickets)
})

socket.on('out',( id ,inning,value,type)=>{
    console.log( id ,inning,value,type)
    updateBatterWicket(id ,inning,value)
})

socket.on('get-score',( inning ,value,type,overs ,balls)=>{
    console.log( inning ,value,type,overs ,balls)  
    updateOver(inning ,overs ,balls)
    if(type === 'runs'){
        updateteamRuns(inning ,value)
    }else if(type === 'wickets'){
        updateTeamWicket(inning ,value)
    }
})

socket.on('new-batter-id',( id ,inning)=>{
    console.log( inning ,id)  
    const div = document.getElementById(id);
    const name = document.getElementById(`batterName${id}`).innerText;
    createNewBatter(id,name,inning);
    div.parentNode.removeChild(div);
})

socket.on('new-bowler-id',( id ,inning)=>{
    console.log(  id ,inning)  
    const div = document.getElementById(id);
    const name = document.getElementById(`batterName${id}`).innerText;
    div.parentNode.removeChild(div);
    createNewBaller(+id,name,inning)
})

function updateBatterWicket(id ,inning,type){
    const row = document.getElementById(id);
    const div = document.createElement('div');
    div.innerHTML = `<a>( ${type} )</a>`;
    row.appendChild(div);
}

function updateBowlerWickets(id ,inning,wickets){
    document.getElementById(`${inning}ballerWickets${id}`).innerText = wickets
}

function updateBowlerStats(id ,inning,over,runs){
    let overs = over/10;
    if(over%6 === 0)overs = over/6;
    document.getElementById(`${inning}ballerOvers${id}`).innerText = overs;
    // document.getElementById(`${inning}ballerWickets${id}`)
    document.getElementById(`${inning}ballerRuns${id}`).innerText = runs;
    const rr = (Math.round((runs/((Math.round(overs)*6)+over%10))*100))/100 || 0;
    document.getElementById(`${inning}rr${id}`).innerText = rr;

}

function updateBatterStats(id ,inning,runs ,sixes ,fours ,balls){
    document.getElementById(`${inning}batterRuns${id}`).innerText = runs;
    document.getElementById(`${inning}sixes${id}`).innerText = sixes;
    document.getElementById(`${inning}fours${id}`).innerText = fours;
    document.getElementById(`${inning}batterBalls${id}`).innerText = balls;

    const sr = (Math.round((runs/balls)*100))/100;
    document.getElementById(`${inning}sr${id}`).innerText = sr;
}

function updateteamRuns(inning ,value){
    const runs = document.getElementById(`runs${inning}`);
    runs.innerText = value;
} 

function updateTeamWicket(inning ,value){
    const wicket =  document.getElementById(`wickets${inning}`);
    wicket.innerText = value;
}
function updateOver(inning,overs ,balls){
    if(balls === 6){
        balls = 0;
        overs++
    }
    document.getElementById(`overs${inning}`).innerText = overs;
    document.getElementById(`balls${inning}`).innerText = balls;
}

function displayBatterStats(id ,inning,runs,sixes,fours,balls,name,state){
    console.log(id ,inning,runs,sixes,fours,balls,name)
    const table = document.getElementById(`battersTable${inning}`);
    const row = document.createElement('tr');
    const sr = (Math.round((runs/balls)*100)) || 0;
    row.id=`${id}`;
    row.class = inning;
    row.innerHTML =`
        <td id="batterName${id}">${name}</td>
        <td id="${inning}batterRuns${id}">${runs}</td>
        <td id="${inning}batterBalls${id}">${balls}</td>
        <td id="${inning}sixes${id}">${sixes}</td>
        <td id="${inning}fours${id}">${fours}</td>
        <td id="${inning}sr${id}">${sr}</td>
        <a>${state}</a>
    `;
    table.appendChild(row);
} 
function displayBowlerStats(id ,inning,runs ,wickets,overs,name){

    const table = document.getElementById(`ballersTable${inning}`);
    const currentBallerName = document.getElementById('currentBallerName');
    const row = document.createElement('tr');
    let over = Math.floor(overs/10);//(Math.round(currentBallerRuns/((bowlerOvers*6)+balls)*6)*100)/100;
    let balls = overs%10;
    console.log(balls)
    if(balls%6 === 0){
        over++;
        balls = 0
    }
    const rr = (Math.floor(runs/((over*6)+balls)*6)*100)/100 || 0
    currentBallerName.innerText = name;
    row.id = `bowler${id}`;
    row.innerHTML =`
                        <td id="ballerName${id}">${name}</td>
                        <td id="${inning}ballerOvers${id}">${over}.${balls}</td>
                        <td id="${inning}ballerWickets${id}">${wickets}</td>
                        <td id="${inning}ballerRuns${id}">${runs}</td>
                        <td id="${inning}rr${id}">${rr}</td>
                        
    `;
    table.appendChild(row);
} 

function showPlayer(teamNo,id ,name){
    const table = document.getElementById(`table${teamNo}2`);
    const row = document.createElement('tr');
    row.id=`${id}`;
    row.class = teamNo;
    row.innerHTML =`
        <td id="batterName${id}">${name}</td>
    `;

    table.appendChild(row);
}
function createNewBaller(id,name,inning){
    const table = document.getElementById(`ballersTable${inning}`);
    const currentBallerName = document.getElementById('currentBallerName');
    const row = document.createElement('tr');

    currentBallerName.innerText = name;
    row.id = `bowler${id}`;
    row.innerHTML =`
                        <td id="ballerName${id}">${name}</td>
                        <td id="${inning}ballerOvers${id}">0</td>
                        <td id="${inning}ballerWickets${id}">0</td>
                        <td id="${inning}ballerRuns${id}">0</td>
                        <td id="${inning}rr${id}">0</td>
                        
    `;
    table.appendChild(row);
    
};

function createNewBatter(id,name,teamNo){
    console.log(teamNo)
    const table = document.getElementById(`battersTable${teamNo}`);
    const row = document.createElement('tr');
    row.id=`${id}`;
    row.innerHTML =`
        <td id="batterName${id}">${name}</td>
        <td id="${teamNo}batterRuns${id}">0</td>
        <td id="${teamNo}batterBalls${id}">0</td>
        <td id="${teamNo}sixes${id}">0</td>
        <td id="${teamNo}fours${id}">0</td>
        <td id="${teamNo}sr${id}">0</td>
        <a>not out</a>
    `;
    table.appendChild(row);
}

function displayTeamName(name1 ,name2 ,overs){
    const team1Name = document.getElementById('team1Name');
    const team2Name = document.getElementById('team2Name');
    document.getElementById('oversMatch1').innerText = overs;
    document.getElementById('oversMatch2').innerText = overs;
    team1Name.innerText =name1;
    team2Name.innerText =name2
}

function displayScore(teamNo,r ,w ,o ,b ){
    const runs = document.getElementById(`runs${teamNo}`);
    const wickets = document.getElementById(`wickets${teamNo}`);
    const overs = document.getElementById(`overs${teamNo}`);
    const balls = document.getElementById(`balls${teamNo}`);

    runs.innerText = r;
    wickets.innerText = w;
    overs.innerText =o;
    balls.innerText =b;

}