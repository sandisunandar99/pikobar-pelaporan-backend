
const historyCheck = (history) => {
    let abroad,city,positive,notes
    if(history !== ""){

        if(history.is_went_abroad == true){
            abroad = `Dari Luar Negeri Mengunjungi Negara ${history.visited_country}`
        }else{
            abroad = ""
        }

        if(history.is_went_other_city == true){
            city = `Perjalanan ke luar kota Mengunjungi Kota ${history.visited_city}`
        }else{
            city = ""
        }

        if(history.is_contact_with_positive == true){
            positive = "Kontak Dengan Pasien Positif"
        }else{
            positive = ""
        }

        if(history.history_notes){
            notes = history.history_notes
        }else{
            notes = ""
        }
        var a = (abroad != "" ? "," : "")
        var b = (city != "" ? "," : "")
        var c = (positive != "" ? "," : "")
    }
    return `${abroad}${a}${city}${b}${positive}${c}${notes}`
}


module.exports = {
  historyCheck,
}