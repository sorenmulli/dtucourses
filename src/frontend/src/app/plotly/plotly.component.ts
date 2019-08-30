import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { IData, ILayout } from "./plotly";

declare var Plotly: any;

@Component({
  selector: 'plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css']
})
export class PlotlyComponent implements OnInit {

  // Gode links
  // https://stackoverflow.com/questions/33027334/categorical-axis-order-in-plotly-js
  // https://github.com/plotly/angular-plotly.js
  // https://medium.com/better-programming/how-to-use-plotly-js-with-angular-8-2cbf74fd29ba
  // https://plot.ly/javascript/reference/#layout

  @Input() private data: IData[];
  @Input() private layout: ILayout;
  
  private dataDefaults: IData;
  private layoutDefaults: ILayout = {
    autoexpand: "true", autosize: "true",
    margin: {autoexpand: "true", margin: 0},
    // type: "scattergl",
    hovermode: "closest",
    xaxis: {
      linecolor: "black",
      linewidth: 2,
      mirror: true,
      title: "",
      automargin: true
    },
    yaxis: {
      linecolor: "black",
      linewidth: 2,
      mirror: true,
      automargin: true,
      title: 'Any other Unit'
    },
  };

  @ViewChild("graph", {static: true})
  private graph: ElementRef;

  constructor() { }

  ngOnInit() {
    console.log(this.data);

    // Lægger defaults til modtaget data og layout
    for (let dat of this.data) {
      dat = {...this.dataDefaults, ...dat}
    }
    // Starter med at kombinere alle layoutting, der objekter
    for (let key of Object.keys(this.layout)) {
      if (typeof this.layout[key] === "object") {
        this.layout[key] = {...this.layoutDefaults[key], ...this.layout[key]}
      }
    }
    // Dernæst sammenkøres de
    this.layout = {...this.layoutDefaults, ...this.layout};
    
    this.graph = Plotly.newPlot( 
      this.graph.nativeElement, 
      this.data, 
      this.layout,
      { 
        responsive: true,
        scrollZoom: true,
      }
    );
  }

}
