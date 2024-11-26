export function msToMins(ms) {
    let mins = Math.floor(ms / 60000);
    let secs = ((ms % 60000) / 1000).toFixed(0);
    return (secs === 60 ? (mins + 1) + ":00" : mins + ":" + (secs < 10 ? "0" : "") + secs);
}

export function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cutoff(string, charlimit) {
    if (string.length <= charlimit) return string;
    else return string.slice(0, charlimit) + '...';
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
}
  


//format number (for list, header-card)