var csvArr = [];
var jsonObj = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObj.length; i++) {
    csvArr.push(jsonObj[i].split(','));
}
console.log("retrieved csv", csvArr);

for(var i=2; i<csvArr.length; i++) {
    if(csvArr[i][0] === "")break;
    word_count[csvArr[i][0]] = parseInt(csvArr[i][1]);
    if(parseInt(csvArr[i][1]) > maxPair.value){
        maxPair.key = csvArr[i][0];
        maxPair.value = parseInt(csvArr[i][1]);
    }
}

<script>
// The most popular search queries. Scoring is on a relative scale
// where a value of 100 is the most commonly searched query,
// 50 is a query searched half as often as the most popular query, and so on.
var request = new XMLHttpRequest();
request.open("GET", "art&entertainment.csv", false);
request.send(null);

var csvArr = [];
var jsonObj = request.responseText.split(/\r?\n|\r/);

for (var i = 0; i < jsonObj.length; i++) {
    csvArr.push(jsonObj[i].split(','));
}
console.log("retrieved csv", csvArr);

drawWordCloud();

function drawWordCloud(){
    var word_count = {};
    var arrived = false;
    var maxPair = {key: "", value: -1};
    for(var i=2; i<csvArr.length; i++) {
        if(csvArr[i][0] === "RISING") {
            arrived = true;
        }
        if(arrived && csvArr[i].length > 1 && csvArr[i][0] !== "") {
            if( csvArr[i].length > 2) word_count[csvArr[i][0]] = parseInt(csvArr[i][1][csvArr[i][1].length-1])*1000 + parseInt(csvArr[i][2].substring(0,3));
            else word_count[csvArr[i][0]] = parseInt(csvArr[i][1].substring(0,3));
        }
    }
    console.log("maxPair", maxPair);
    console.log(Object.keys(word_count).length);

    var svg_location = "#chart";
    var width = 800;
    var height = 800;

    var colors = d3.scale.category20();

    var word_entries = d3.entries(word_count);
    console.log(word_entries);

    var myRange = d3.scale.linear()
        .domain([0, d3.max(word_entries, function(d) {
            return d.value;
        })
            // map to minimum range 30 so that least frequent
            //word does not appear too small
        ]).range([30,70]);

    d3.layout.cloud().size([width, height])
        .words(word_entries)
        .fontSize(function(d) { return myRange(d.value); })
        .text(function(d) { return d.key; })
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            // add translate so that words are not cut off by top left corner
            .attr("transform", "translate(" + [width >>1, height>>1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return myRange(d.value) + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return colors(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.key; });
    }
}
</script>