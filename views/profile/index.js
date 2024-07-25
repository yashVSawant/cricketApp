
const token = localStorage.getItem('token');
const back = document.getElementById('back');
const upload = document.getElementById('upload');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const data = await axios.get('/user/api/data',{headers:{'Authorization':token}});
        const playerData = data.data.data;
        // console.log(playerData , data)
        display(data.data.name ,playerData.playerType ,playerData.matches ,playerData.runs ,playerData.wickets,playerData.fours,playerData.sixes,playerData.highestScore,playerData.highestWickets,playerData.balls,playerData.overs);
        dispalyPhoto(playerData.imageUrl)
    } catch (err) {
        console.log(err)
        alert(err.response.data.message);
    }
});

back.onclick = ()=>{
    window.location.href = '../home/index.html';
}
upload.onclick = ()=>{
    const photoFile = document.getElementById('photoFile').files[0];
    uploadPhoto(photoFile);
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

function uploadPhoto(file){
// const file = document.getElementById('file').files[0]
// console.log(file)
    const MIME_TYPE = "image/jpeg";
    const QUALITY = 0.85;
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 320, 180);
    URL.revokeObjectURL(this.src);
    canvas.toBlob(async(blob) => {
       
                console.log(blob)
                const formData = new FormData();
                formData.append('file', blob);
                const data = await axios.post(`/user/api/data/photo`,formData,{headers:{'Authorization':token,'Content-Type': 'multipart/form-data'},'enctype':"multipart/form-data"})
                    .catch((err)=>{alert(err.response.data.message)});
                dispalyPhoto(data.data.imageUrl);
                console.log(data.data.imageUrl);
            },
            MIME_TYPE,
            QUALITY
        );
    
    }
}

function dispalyPhoto(url){
    if(url){
        const div = document.getElementById('image');
        const image = document.createElement('img');
        image.src = url;
        div.innerHTML = '';
        div.appendChild(image);
    }
}
