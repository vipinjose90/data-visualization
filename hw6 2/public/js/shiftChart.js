/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates,selectedYears){

     
     // ******* TODO: PART V *******

        let uli =
            d3.select("#stateList")
                .selectAll("ul")
                .data([""])

        uli.exit().remove()

        uli = uli
            .enter()
            .append("ul")
            .merge(uli)

        if(selectedStates!=null) {

            let ulist =
                uli
                    .selectAll("li")
                    .data(selectedStates)

            ulist.exit().remove()

            ulist = ulist
                .enter()
                .append("li")
                .merge(ulist)

            ulist
                .text(function (d) {
                    return d.State
                })
        }




    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

        if(selectedYears!=null) {

            let ulist =
                uli
                    .selectAll("li")
                    .data(selectedYears)

            ulist.exit().remove()

            ulist = ulist
                .enter()
                .append("li")
                .merge(ulist)

            ulist
                .text(function (d) {
                    return d.YEAR
                })
        }

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };


}
