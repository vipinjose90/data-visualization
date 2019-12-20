
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart,shiftChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        this.shiftChart = shiftChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

       // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        let thisClass = this

        let circleSpacing = this.svgWidth/this.electionWinners.length-1;

        this.svg
            .append("line")
            .attr("x1",15)
            .attr("x2",thisClass.svgWidth)
            .attr("y1",thisClass.svgHeight/2 -10)
            .attr("y2",thisClass.svgHeight/2 -10)
            .attr("stroke", "grey")
            .attr("stroke-dasharray","1, 1")


        let circles =
            this.svg
                .selectAll("circle")
                .data(this.electionWinners)
                .enter()
                .append("circle")
                .attr("cx",function (d,i) {
                    return i*circleSpacing + 40

                })
                .attr("cy",function (d,i) {
                    return thisClass.svgHeight/2 -10
                })
                .attr("r",7)
                .attr("class",
                    function(d){
                        return thisClass.chooseClass(d.PARTY)
                    })
                .on("mouseenter", function (d) {
                    d3.select(this).classed("highlighted",true)
                })
                .on("mouseleave", function (d) {
                    d3.select(this).classed("highlighted",false)
                })
                .on("click", function (d) {
                    d3.select(".selected").classed("selected",false)
                    d3.select(this).classed("selected",true)
                    d3.csv("data/Year_Timeline_"+d.YEAR+".csv", function (error, electionResult) {
                        electoralVoteChart.update(electionResult,thisClass.colorScale)
                        votePercentageChart.update(electionResult)
                        tileChart.update(electionResult,thisClass.colorScale)

                    });
                })


        this.svg
            .selectAll("text")
            .data(this.electionWinners)
            .enter()
            .append("text")
            .attr("x",function (d,i) {
                return i*circleSpacing + 40

            })
            .attr("y",function (d,i) {
                return thisClass.svgHeight/2 +10
            })
            .classed("yearText",true)
            .text(function (d) {
                return d.YEAR
            })


    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

        let brush = d3.brushX().extent([[0,48],[this.svgWidth,this.s]]).on("end", function () {
            let cumSum = 0
            let currentSelection = d3.event.selection
            let brushArray = []
            thisClass.electionWinners.forEach(function (d,i) {
                if(i*circleSpacing + 40 >= currentSelection[0] && i*circleSpacing + 40 <= currentSelection[1]){
                    brushArray.push(d)
                }
            })
            thisClass.shiftChart.update(null,brushArray)
        });
        //Implement a call back method to handle the brush end event.
        this.svg.append("g").attr("class", "brush").call(brush);

    };

};