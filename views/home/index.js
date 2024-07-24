const profile = document.getElementById('profile');
const tournaments = document.getElementById('tournaments');
const showTeam = document.getElementById('showTeam');
const createTeam = document.getElementById('createTeam');
const displayPlayers = document.getElementById('displayPlayers');
const create = document.getElementById('create');
const leaderboard = document.getElementById('leaderboard')
const displayLeaderBoard = document.getElementById('displayLeaderBoard');

let teamId = 0;

const host = 'http://localhost:3333';
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const info = await axios.get('/tournament/api/ongonigTournaments',{headers:{'Authorization':token}});
        info.data.info.forEach((t)=>{
            displayTournaments(t.id , t.name ,t.startDate ,t.endDate ,t.address);
        });
        const data = await axios.get('/team/api/',{headers:{'Authorization':token}});
        data.data.team.forEach((t)=>{
            displayTeam(t.id ,t.name);
        });
        
    } catch (err) {
        alert(err.response.data.message);
    }
    
})

profile.onclick = async()=>{
    window.location.href = '../profile/index.html';
    
}
createTeam.onclick = ()=>{
    const createTeamDiv = document.getElementById('createTeamDiv');
    if(createTeamDiv.style.display === "inline"){
        createTeamDiv.style.display = 'none'
    }else{
        createTeamDiv.style.display = 'inline'
    }
}

create.onclick = async()=>{
    const name = document.getElementById('name').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(name && password && confirmPassword){
        if(password === confirmPassword){
            try {
                const post = await axios.post('/team/api/',{name , password },{headers:{'Authorization':token}});
                const createTeamDiv = document.getElementById('createTeamDiv');
                createTeamDiv.style.display = 'none';
                alert('team posted');
                displayTeam(post.data.team.id ,post.data.team.name);
            } catch (err) {
                console.log(err)
                alert(err.response.data.message)
            }
        }else{
            alert('password did not match')
        }
    }else{
        alert('please fill all fields')
    }
    
}

tournaments.addEventListener('click',(e)=>{
    if(e.target.classList.value === 'watchScore'){
        const id =e.target.parentNode.id;
        localStorage.setItem('tournamentId',id);
        window.location.href = '../score/index.html'
    }
})

showTeam.addEventListener('click',async(e)=>{
    if(e.target.classList.value === 'player'){
        try {
            const id = e.target.parentNode.id;
            const data = await axios.get(`/team/api/${id}/players`,{headers:{'Authorization':token}});
            tournaments.style.display = 'none';
            displayLeaderBoard.innerHTML= '';
            displayPlayers.innerHTML= '';
            addBackButton(displayPlayers);
            

            const isCaptain = data.data.isCaptain;
            console.log(isCaptain)
            if(isCaptain){
                addDeleteButton()
                displayInputDiv();     
            }
            data.data.players.forEach((p)=>{
                showPlayers(p.id ,p.name,isCaptain);
            })
            teamId = e.target.parentNode.id;
        } catch (err) {
            alert(err.response.data.message)
        }
        
    }
})

leaderboard.onclick = async()=>{
    displayPlayers.innerHTML= '';
    tournaments.style.display = 'none';
    
    displayLeaderBoard.innerHTML = `<div id="batter"><div>Batter</div></div>
                <div id="bowler"><div>Bowler</div></div>`
                
    addBackButton(displayLeaderBoard);
    try {
        const batterData = await axios.get('/user/api/top5/batter',{headers:{'Authorization':token}});
        const bowlerData = await axios.get('/user/api/top5/bowler',{headers:{'Authorization':token}});
        batterData.data.top5.forEach((b)=>{
            displayBatterBoard(b.user.name  , b.runs)
        })
        bowlerData.data.top5.forEach((b)=>{
            displayBowlerBoard(b.user.name  , b.wickets)
        })
    } catch (err) {
        alert(err.response.data.message)
    }
    
    
}

displayPlayers.addEventListener('click',async(e)=>{
    if(e.target.classList.value === 'remove'){
        try {
            const id = e.target.parentNode.id;
            await axios.delete(`/team/api/${teamId}/${id}/remove`,{headers:{'Authorization':token}});
            e.target.parentNode.parentNode.removeChild(e.target.parentNode)
        } catch (err) {
            alert(err.response.data.message)
        }
        

    }
})

function displayBatterBoard(name,runs){
    const div = document.createElement('div');
    div.className = 'leaderboard'
    div.innerHTML = `<h3>${name}</h3>     -     <h3>${runs}</h3>`;

    document.getElementById('batter').appendChild(div);
}
function displayBowlerBoard(name,runs){
    const div = document.createElement('div');
    div.className = 'leaderboard'
    div.innerHTML = `<h3>${name}</h3>     -     <h3>${runs}</h3>`;

    document.getElementById('bowler').appendChild(div);
}

function displayTournaments(id , name , startDate , endDate , location){
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}">
    <h4>${name}</h4><a>(${startDate} - ${endDate}) (${location})</a>
    <button class="watchScore">watch score</button>
    </div>`;
    tournaments.appendChild(div);
}

function displayTeam(id ,name){
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="teamDiv">
    <h4>${name}</h4>
    <button class="player">players</button>
    </div>`;
    showTeam.appendChild(div);
}

function showPlayers(id ,name ,isCaptain){

    const removeButton = isCaptain ?'<button class="remove">remove</button>':'';
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="playerDiv">
    <h4>${name}</h4>
    ${removeButton}
    </div>`;
    displayPlayers.appendChild(div);
}

function addBackButton(displayDiv){
    const div = document.createElement('div');
    div.innerHTML = '<button id="back">Back</button>'
    displayDiv.appendChild(div);

    const back = document.getElementById('back');

    back.onclick = ()=>{
        displayPlayers.innerHTML= '';
        tournaments.style.display = 'inline';
        displayLeaderBoard.innerHTML ='';
    }
}

function addDeleteButton(){
    const div = document.createElement('div');
    div.innerHTML = '<button id="delete">Delete</button>'
    displayPlayers.appendChild(div);

    const del = document.getElementById('delete');

    del.onclick = async()=>{
        try {
            await axios.delete(`/team/api/${teamId}`,{headers:{'Authorization':token}});
            const team = document.getElementById(teamId)
            team.parentNode.removeChild(team);
            displayPlayers.innerHTML= '';
            tournaments.style.display = 'inline';
            displayLeaderBoard.innerHTML ='';
        } catch (err) {
            alert(err.response.data.message)
        }
       
    }
}

function displayInputDiv(){
    const div = document.createElement('div');
    div.innerHTML =`<div >
                <label>Username:</label>
                <input type="text" id="playerName">
                <label>Password:</label>
                <input type="password" id="playerPassword">
                <button id="add">add</button>
            </div>`;
    displayPlayers.appendChild(div);
    const add = document.getElementById('add');
    add.onclick = async()=>{
        const name = document.getElementById('playerName').value;
        const password = document.getElementById('playerPassword').value;
        if(name && password){
            try {
                
                const playerData = await axios.post('/team/api/addPlayer',{name,password,teamId} ,{headers:{'Authorization':token}});
                const player = playerData.data.player;
                showPlayers(player.id ,player.name,true);
                document.getElementById('playerName').value = "";
                document.getElementById('playerPassword').value="";
            } catch (err) {
                alert(err.response.data.message)
            }
        }else{
            alert('please fill all fields!')
        }
        
    }
}