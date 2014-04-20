
this.calculateScores = function(p1rate, p2rate, winner, callback) {

    var p1Expected = 1/(1+Math.pow(10,-(p1rate-p2rate)/400));

    var k;
    if(p1rate<2100 || p2rate<2100) k = 32;
    else if(p1rate<2401 || p2rate<2401) k = 24;
    else k = 16;

    var p1Score;
    if(winner == 1) p1Score = 1;
    else if(winner == 2) p1Score = 0;

    dRate = Math.round(k*(p1Score-p1Expected));

    var newP1rate = p1rate + dRate;
    var newP2rate = p2rate - dRate;

    callback(newP1rate, newP2rate);

}

module.exports = this;
