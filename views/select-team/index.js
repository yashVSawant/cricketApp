const token = localStorage.getItem('token');
const optionFindTeam1 = document.getElementById('optionFindTeam1');
const optionFindTeam2 = document.getElementById('optionFindTeam2');

const findTeam1 = document.getElementById('findTeam1');
const findTeam2 = document.getElementById('findTeam2');

const fixTeam1 = document.getElementById('fixTeam1');
const fixTeam2 = document.getElementById('fixTeam2');

const createTeam1 = document.getElementById('createTeam1');
const createTeam2 = document.getElementById('createTeam2');

const postTeam1 = document.getElementById('postTeam1');
const postTeam2 = document.getElementById('postTeam2');

const add1 = document.getElementById('add1');
const add2 = document.getElementById('add2');

const start  = document.getElementById('start');



let team1 = false;
let team2 = false;

let team1Id;
let team2Id;

let playing111=[];
let playing112=[];

add1.onclick = async()=>{
    const email = document.getElementById('player1Email').value;
    const password = document.getElementById('player1Password').value;
    if(email && password){
        const teamId = team1Id;
        const playerData = await axios.post('/team/api/addPlayer',{email,password,teamId} ,{headers:{'Authorization':token}});
        const player = playerData.data.player;
        displayPlayer(1 ,player.id , player.name , player.email)
    }else{
        alert('please fill all fields!')
    }
    
}
add2.onclick = async()=>{
    const email = document.getElementById('player2Email').value;
    const password = document.getElementById('player2Password').value;
    if(email && password){
        const teamId = team2Id;
        const playerData = await axios.post('/team/api/addPlayer',{email,password,teamId} ,{headers:{'Authorization':token}});
        const player = playerData.data.player;
        displayPlayer(2 ,player.id , player.name , player.email)
    }else{
        alert('please fill all fields!')
    }
    
}

start.onclick = ()=>{
    try {
        const matchOvers = document.getElementById('overs').value;
        const  battingFirst = document.querySelector('input[name="tossWon"]:checked').value;
        
        if(!team1)alert('please select team1')
        else if(!team2)alert('please select team2')
        else if(!matchOvers)alert('please enter overs')
        else{
            console.log(matchOvers , battingFirst);
            localStorage.setItem('battingFirst',battingFirst);
            localStorage.setItem('matchOvers',matchOvers);
            location.href = '/scoreBook/index.html';
        }
    } catch (err) {
        alert('please enter batting first team');
    }
    
        
    
}

postTeam1.onclick = async()=>{
    const name = document.getElementById('newTeamName1').value;
    const email = document.getElementById('newTeamEmail1').value;
    const password1 = document.getElementById('password11').value;
    const password2 = document.getElementById('password21').value;
    if(name && email && password1 && password2){
        if(password1 === password2){
            try {
                const password = password1;
                const post = await axios.post('/team/api/postTeam',{name , password ,email},{headers:{'Authorization':token}});
                team1Id = post.data.team.id;
                alert('team posted');
                hideCreateTeamDiv1();
            } catch (error) {
                console.log(error)
                alert('something went wrong!')
            }
        }else{
            alert('password did not match')
        }
    }else{
        alert('please fill all fields')
    }
    
}
postTeam2.onclick = async()=>{
    const name = document.getElementById('newTeamName2').value;
    const email = document.getElementById('newTeamEmail2').value;
    const password1 = document.getElementById('password12').value;
    const password2 = document.getElementById('password22').value;
    if(name && email && password1 && password2){
        if(password1 === password2){
            try {
                const password = password1;
                const post = await axios.post('/team/api/postTeam',{name , password ,email},{headers:{'Authorization':token}});
                team2Id= post.data.team.id
                alert('team posted');
                hideCreateTeamDiv2()
            } catch (error) {
                console.log(error)
                alert('something went wrong!')
            }
        }else{
            alert('password did not match')
        }
    }else{
        alert('please fill all fields')
    }
    
}

createTeam1.onclick = ()=>{
    hidefindTeamDiv1();
}

createTeam2.onclick = ()=>{
    hidefindTeamDiv2();
}

optionFindTeam1.onclick = ()=>{
    hideCreateTeamDiv1()
}
optionFindTeam2.onclick = ()=>{
   hideCreateTeamDiv2()
}


findTeam1.onclick = async()=>{
    try {
        const email = document.getElementById('team1Email').value;
        const password = document.getElementById('team1Password').value;
        const teamData = await axios.post('/team/api/getTeam',{email , password},{headers:{'Authorization':token}});
        // console.log(teamData.data.players)
        showTeamName(1,teamData.data.team.name);
        team1Id = teamData.data.team.id
        showTeamDiv(teamData.data.players,1);
        showCreateFindButton1()
    } catch (err) {
        console.log(err)
        alert('something went wrong!');
    }
    
}
findTeam2.onclick = async()=>{
    try {
        const email = document.getElementById('team2Email').value;
        const password = document.getElementById('team2Password').value;
        const teamData = await axios.post('/team/api/getTeam',{email , password},{headers:{'Authorization':token}});
        showTeamName(2,teamData.data.team.name);
        team2Id = teamData.data.team.id
        showTeamDiv(teamData.data.players,2);
        showCreateFindButton2()
    } catch (err) {
        console.log(err)
        alert('something went wrong!');
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
        playing111 = team;
    } else{
        playing112 = team;
    }
}

function showTeamName(teamNo,name){
    const nameDiv = document.getElementById(`team${teamNo}name`);
    nameDiv.innerText = name;
}

function checkSelectedPlayer(teamNo){
    const checkboxes = document.querySelectorAll(`#main${teamNo} input[type="checkbox"]`);
    console.log(checkboxes)
    let playing11=[] ;
    let fullTeam ;
    let numberOfSelectedPlayers = 0;
    if(teamNo===1)fullTeam = playing111;
    else fullTeam=playing112;
    for(let i=0 ;i<fullTeam.length ;i++){
        if(checkboxes[i].checked){
            numberOfSelectedPlayers++;
            playing11.push(fullTeam[i]);
        }
    }
    console.log(numberOfSelectedPlayers)
    if(numberOfSelectedPlayers != 11){
        if(teamNo === 1)team1 = false;
        else team2 = false;
        alert('please select 11 players!')
    }else{
        if(teamNo===1){
            team1 = true;
            const name = document.getElementById('team1name').innerText;
            localStorage.setItem('name1',name)
            localStorage.setItem('team1',JSON.stringify(playing11))
        }
        else {
            team2  = true;
            const name = document.getElementById('team2name').innerText;
            localStorage.setItem('name2',name)
            localStorage.setItem('team2',JSON.stringify(playing11))
        }
        alert('team posted')
        
    }
}

function hidefindTeamDiv1(){
    const createTeam1Div = document.getElementById('createTeam1Div');
    createTeam1Div.style.display = 'flex'
    const findTeamDiv1 = document.getElementById('findTeamDiv1');
    findTeamDiv1.style.display = 'none';
    createTeam1.style.display = 'none';
    optionFindTeam1.style.display = 'flex';
}
function hidefindTeamDiv2(){
    const createTeam2Div = document.getElementById('createTeam2Div');
    createTeam2Div.style.display = 'flex'
    const findTeamDiv2 = document.getElementById('findTeamDiv2');
    findTeamDiv2.style.display = 'none';
    createTeam2.style.display = 'none';
    optionFindTeam2.style.display = 'flex'
}


function hideCreateTeamDiv1(){
    const createTeam1Div = document.getElementById('createTeam1Div');
    createTeam1Div.style.display = 'none'
    const findTeamDiv1 = document.getElementById('findTeamDiv1');
    findTeamDiv1.style.display = 'flex';
    optionFindTeam1.style.display = 'none';
    createTeam1.style.display = 'flex';
}
function hideCreateTeamDiv2(){
    const createTeam2Div = document.getElementById('createTeam2Div');
    createTeam2Div.style.display = 'none'
    const findTeamDiv2 = document.getElementById('findTeamDiv2');
    findTeamDiv2.style.display = 'flex';
    optionFindTeam2.style.display = 'none';
    createTeam2.style.display = 'flex';
}

function showCreateFindButton1(){
    const findTeamDiv1 = document.getElementById('findTeamDiv1');
    findTeamDiv1.style.display = 'none';
    optionFindTeam1.style.display = 'flex';
}
function showCreateFindButton2(){
    const findTeamDiv2 = document.getElementById('findTeamDiv2');
    findTeamDiv2.style.display = 'none';
    optionFindTeam2.style.display = 'flex';
}

function displayPlayer(teamNo ,id ,name ,email){
    const main = document.getElementById(`main${teamNo}`);
    const div = document.createElement('div');
        div.id=id;
        div.innerHTML = `
        <div class="playerDiv" id="${id}"><h4>${name}</h4> ( <h4>${email}</h4> ) <input type="checkbox">
        </div>
        `
    main.appendChild(div);
}
