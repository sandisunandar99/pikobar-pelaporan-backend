'use strict';
const filterEdges = (this_) => {
    const replaceString = this_.id_case.replace("covid-","");
    const gender = (this_.gender == 'L' ? 'male' : 'female');
    let image = 'avatar/';
    let status;
    // logic status label
    if(this_.status == 'ODP' || this_.status == 'PDP' || this_.status == 'OTG'){
        status = 'normal';
    }
    if(this_.status == 'POSITIF' && 
        this_.final_result == '' || this_.final_result == null 
        || this_.final_result == 0){
        status = 'positive_active';
    }
    if(this_.status == 'POSITIF' && this_.final_result == 1){
        status = 'positive_recovery';
    }
    if(this_.status == 'POSITIF' && this_.final_result == 2){
        status = 'positive_dead';
    }
    // logic image label by age
    if(this_.age >= 0 && this_.age <= 1){
        image += `baby-${gender}-${status}.svg`;
    }
    if(this_.age >= 2 && this_.age <= 5){
        image += `child-${gender}-${status}.svg`;
    }
    if(this_.age >= 6 && this_.age <= 19){
        image += `teen-${gender}-${status}.svg`;
    }
    if(this_.age >= 20 && this_.age <= 59){
        image += `adult-${gender}-${status}.svg`;
    }
    if(this_.age >= 60){
        image += `elderly-${gender}-${status}.svg`;
    }
    return {
        id: this_._id,
        label: replaceString,
        shape: 'image',
        image: image,
        size: (this_.status == 'POSITIF' ? 50 : ''),
    }
}
const filterNodes = (this_) => {
    return {
        from: this_.id_case,
        to: this_.id_case_related,
    }
}
module.exports = {
    filterEdges, filterNodes 
}