console.log("ed");

let cptTour = 1;
let tours = {0: [['Ayoub', 'Ahmed'], ['Ismail', 'Yousssef']], 1: [['Ahmed', 'Ismail']], 2: [['Ismail']]}
let toursObjs = {}
let objectsCpt = 0;


while (cptTour - 1< Object.keys(tours).length)
{
    let tourClassName = 'username_round' + cptTour;
    toursObjs = document.getElementsByClassName(tourClassName)
    console.log(tourClassName)
    for (i = 0; i < tours[cptTour - 1].length; i++)
    {
        toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][0];
        if (tours[cptTour - 1][i].length == 2)
            toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][1];
        // if (tours[cptTour][i].length == 2)
        //     console.log("match : [" + tours[cptTour][i][0] + "," + tours[cptTour][i][1] + "]")
        // else
        //  console.log("match : [" + tours[cptTour][i][0] + "]")
    }
    cptTour++;
    objectsCpt =  0;
}
// for (let i = 0; i < devs.length; i += 0){
//     toursObjs[cptTour][]
// }