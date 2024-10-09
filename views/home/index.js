const profile = document.getElementById('profile');
const tournaments = document.getElementById('tournaments');
const showTeamDiv = document.getElementById('showTeamDiv');
const displayLeaderBoard = document.getElementById('displayLeaderBoard');
const displayPlayers = document.getElementById('displayPlayers');
const createTeamDiv = document.getElementById('createTeamDiv');
const logout = document.getElementById("logout");

const showTeam = document.getElementById('showTeam')
const createTeam = document.getElementById('createTeam');

const create = document.getElementById('create');
const leaderboard = document.getElementById('leaderboard')


let teamId = 0;

const userName = localStorage.getItem('userName');
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const data = await axios.get('/tournament/api/ongonigTournaments',{headers:{'Authorization':token}});
        console.log(data.data)
        if(data.data.tournaments.length === 0){
            displayNoTournament()
        }else{
            data.data.tournaments.forEach((t)=>{
                displayTournaments(t._id , t.name ,t.startDate ,t.endDate ,t.address);
            });
        }
        const userNameH1 = document.getElementById('userNameH1');
        userNameH1.innerText = userName.toUpperCase();
        
    } catch (err) {
        alert(err.response.data.message);
    }
    
})

logout.onclick = ()=>{
    localStorage.removeItem('token');
    location.href = '../login/index.html'
}

profile.onclick = async()=>{
    window.location.href = '../profile/index.html';
    
}

showTeam.onclick = async()=>{
    if(showTeamDiv.innerHTML === ''){
        clearMainDiv();
        const data = await axios.get('/team/api/',{headers:{'Authorization':token}});
            data.data.teams.forEach((t)=>{
                displayTeam(t.id ,t.name);
            });
            showTeamDiv.style.display = 'flex'
    }else{
        clearMainDiv();
        showTournament();
    }
}

createTeam.onclick = ()=>{
    if(createTeamDiv.innerHTML === ""){
        clearMainDiv();
        createTeamDiv.innerHTML = `<label>enter team name:</label>
                <input type="text" id="name">
                <label>enter password:</label>
                <input type="password" id="newPassword">
                <label>confirm password:</label>
                <input type="password" id="confirmPassword">
                <button class="create">create</button>`
    }else{
        clearMainDiv();
        showTournament()
    }
}

createTeamDiv.addEventListener("click",async(e)=>{
    if(e.target.classList.value === 'create'){
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

})

tournaments.addEventListener('click',(e)=>{
    if(e.target.classList.value === 'watchScore'){
        const id =e.target.parentNode.id;
        localStorage.setItem('tournamentId',id);
        window.location.href = '../score/index.html'
    }
})

showTeamDiv.addEventListener('click',async(e)=>{
    if(e.target.classList.value === 'player'){
        clearMainDiv();
        try {
            const id = e.target.parentNode.id;
            const data = await axios.get(`/team/api/${id}/players`,{headers:{'Authorization':token}});
            // addBackButton(displayPlayers);
            addTeamName(data.data.team.name);
            const isCaptain = data.data.isCaptain;
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
    
    if(displayLeaderBoard.innerHTML === ""){
        clearMainDiv();
        displayLeaderBoard.innerHTML = `<div id="batter"><h3>BATTER</h3></div>
                    <div id="bowler"><h3>BOWLER</h3></div>`
                    
        try {
            const batterData = await axios.get('/user/api/top5/batter',{headers:{'Authorization':token}});
            const bowlerData = await axios.get('/user/api/top5/bowler',{headers:{'Authorization':token}});
            batterData.data.top5.forEach((b)=>{
                displayBatterBoard(b.userId.name  , b.runs)
            })
            bowlerData.data.top5.forEach((b)=>{
                displayBowlerBoard(b.userId.name  , b.wickets)
            })
        } catch (err) {
            alert(err.response.data.message)
        }
    }else{
        clearMainDiv();
        showTournament();
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
    <h4>${name}</h4><a>(${startDate} - ${endDate}) (V:${location.village}, T:${location.taluka})</a>
    <button class="watchScore">watch score</button>
    </div>`;
    tournaments.appendChild(div);
}
function displayNoTournament(){
    const div = document.createElement('div');
    div.innerHTML = `<div>
    <h4>No Ongoing Tournament! </h4>
    </div>`;
    tournaments.appendChild(div);
}

function displayTeam(id ,name){
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="teamDiv">
    <h4>${name}</h4>
    <button class="player">players</button>
    </div>`;
    showTeamDiv.appendChild(div);
}

function clearMainDiv(){
    showTeamDiv.innerHTML = "";
    displayPlayers.innerHTML = "";
    displayLeaderBoard.innerHTML = "";
    createTeamDiv.innerHTML = "";
    tournaments.style.display = "none"
}
function showTournament(){
    tournaments.style.display = "flex";
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

// function addBackButton(displayDiv){
//     const div = document.createElement('div');
//     div.innerHTML = '<button id="back">Back</button>'
//     displayDiv.appendChild(div);

//     const back = document.getElementById('back');

//     back.onclick = ()=>{
//         displayPlayers.innerHTML= '';
//         tournaments.style.display = 'inline';
//         displayLeaderBoard.innerHTML ='';
//     }
// }

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

function addTeamName(name){
    const div = document.createElement('div');
    div.innerHTML = `<h2>${name}</h2>`
    displayPlayers.appendChild(div)
}