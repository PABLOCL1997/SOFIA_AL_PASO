export const toDate = (unix_timestamp: string, addHours: boolean = false) => {
    let date = new Date(Number(unix_timestamp));
    let year = date.getFullYear();
    let month = "0" + (date.getMonth() + 1);
    let day = "0" + date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return `${day.substr(-2)}/${month.substr(-2)}/${year}${addHours ? ` ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}` : ''}`;
}