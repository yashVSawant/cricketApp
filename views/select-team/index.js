const token = localStorage.getItem('token');

const findTeam1 = document.getElementById('findTeam1');
const findTeam2 = document.getElementById('findTeam2');

const fixTeam1 = document.getElementById('fixTeam1');
const fixTeam2 = document.getElementById('fixTeam2');

const start  = document.getElementById('start');

let team1 = [];
let team2 = [];

let team1Id =0;
let team2Id =0;

start.onclick = async()=>{
    try {
        const matchOvers = document.getElementById('overs').value;
        const  battingFirst = document.querySelector('input[name="tossWon"]:checked').value;
        
        if(!team1Id)alert('please select team1')
        else if(!team2Id)alert('please select team2')
        else if(!matchOvers)alert('please enter overs')
        else{
            const tournamentId = +(localStorage.getItem('tournamentId'));
            console.log(matchOvers , battingFirst);
            localStorage.setItem('battingFirst',battingFirst);
            localStorage.setItem('matchOvers',matchOvers);
            if(battingFirst === 'team2'){
                console.log(team1Id ,team2Id)
                let temp = team1Id;
                team1Id = team2Id;
                team2Id = temp;
                console.log(team1Id ,team2Id)
            }
            const overs = matchOvers;
            const orderId = localStorage.getItem('orderId');
            const postMatch = await axios.post('/match/api/postMatch',{team1Id ,team2Id,tournamentId,overs,orderId},{headers:{'Authorization':token}});
            
            localStorage.setItem('matchId',(postMatch.data.match.id))
            if(battingFirst === 'team2'){
                console.log(team1Id ,team2Id)
                let temp = team1Id;
                team1Id = team2Id;
                team2Id = temp;
                console.log(team1Id ,team2Id)
            }
            location.href = '/scoreBook/index.html';
        }
    } catch (err) {
        alert(err.response.data.message);
    }
}


findTeam1.onclick = async()=>{
    try {
        const email = document.getElementById('team1Email').value;
        const password = document.getElementById('team1Password').value;
        const teamData = await axios.post('/team/api/match/players',{email , password},{headers:{'Authorization':token}});
        // console.log(teamData.data.players)
        showTeamName(1,teamData.data.team.name);
        team1Id = teamData.data.team.id
        showTeamDiv(teamData.data.players,1);
        
    } catch (err) {
        console.log(err)
        alert(err.response.data.message);
    }
    
}
findTeam2.onclick = async()=>{
    try {
        const email = document.getElementById('team2Email').value;
        const password = document.getElementById('team2Password').value;
        const teamData = await axios.post('/team/api/match/players',{email , password},{headers:{'Authorization':token}});
        showTeamName(2,teamData.data.team.name);
        team2Id = teamData.data.team.id
        showTeamDiv(teamData.data.players,2);
        
    } catch (err) {
        console.log(err)
        alert(err.response.data.message);
    }
}


fixTeam1.onclick = ()=>{
    checkSelectedPlayer(1)
}
fixTeam2.onclick = ()=>{
    checkSelectedPlayer(2)
}

function showTeamDiv(team,teamNo){
    const main = document.getElementById(`main${teamNo}`);
    main.innerHTML = '';
    team.forEach(e => {
        displayPlayer(teamNo ,e.id , e.name , e.email)
    });
    if(teamNo===1){
        team1 = team;
    } else{
        team2 = team;
    }
}

function showTeamName(teamNo,name){
    const nameDiv = document.getElementById(`team${teamNo}name`);
    nameDiv.innerText = name;
}

function checkSelectedPlayer(teamNo){
        if(teamNo===1){
            const name = document.getElementById('team1name').innerText;
            localStorage.setItem('name1',name)
            localStorage.setItem('team1',JSON.stringify(team1))
        }
        else {
            const name = document.getElementById('team2name').innerText;
            localStorage.setItem('name2',name)
            localStorage.setItem('team2',JSON.stringify(team2))
        }
        alert('team posted')
        
    
}

function displayPlayer(teamNo ,id ,name ,email){
    const main = document.getElementById(`main${teamNo}`);
    const div = document.createElement('div');
        div.id=id;
        div.innerHTML = `
        <div class="playerDiv" id="${id}"><h4>${name}</h4> ( <h4>${email}</h4> )
        </div>
        `
    main.appendChild(div);
}
