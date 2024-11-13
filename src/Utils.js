export function msToMins(ms) {
    let mins = Math.floor(ms / 60000);
    let secs = ((ms % 60000) / 1000).toFixed(0);
    return (secs === 60 ? (mins + 1) + ":00" : mins + ":" + (secs < 10 ? "0" : "") + secs);
}

export function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}