const weekDaysTemplate = (DateHelper) => ({
  name: "weekday",
  parent: "day",
  rowsCount: () => 5,
  columnsCount: () => 54,
  mapping: (startTimestamp, endTimestamp) => {
    let weekNumber = 0;
    let x = -1;

    return DateHelper.intervals(
      "day",
      startTimestamp,
      DateHelper.date(endTimestamp)
    )
      .map((ts) => {
        const date = DateHelper.date(ts);

        if (weekNumber !== date.week()) {
          weekNumber = date.week();
          x += 1;
        }

        if (date.format("d") === "0" || date.format("d") === "6") {
          return null;
        }

        return {
          t: ts,
          x,
          y: date.format("d") - 1,
        };
      })
      .filter((n) => n !== null);
  },
});
const cal = new CalHeatmap();
cal.addTemplates(weekDaysTemplate);
cal.paint(
  {
    range: 5,
    date: {
      start: new Date("2007-01-01"),
      min: new Date("2000-05-01"),
      max: new Date("2020-05-01"),
      timezone: "utc",
    },
    data: {
      source: "My_NYPD_Shooting_Incident_Data__Historic",
      type: "csv",
      x: "Date",
      y: (d) => +d["Count"],
    },
    domain: {
      type: "year",
      label: {
        position: "left",
        textAlign: "end",
        width: 50,
        offset: { x: -10, y: 5 },
      },
    },
    legend: {
      show: true,
      label: "Daily Volume",
      width: 150,
      marginLeft: 10,
      marginRight: 10,
    },
    verticalOrientation: true,
    subDomain: {
      type: "weekday",
    },
    scale: {
      color: {
        type: "quantize",
        domain: [50000000, 500000000],
        scheme: "YlOrRd",
      },
    },
    itemSelector: "#ex-stock",
  },
  [
    [LegendLite, { itemSelector: "#ex-stock-legend", includeBlank: true }],
    [
      Tooltip,
      {
        text: function (date, value, dayjsDate) {
          return (
            (value ? d3.format(",")(value) : "No volume") +
            " on " +
            dayjsDate.format("dddd LL")
          );
        },
      },
    ],
  ]
);

render(
  <div>
    <div id="ex-stock" className="margin-bottom--md"></div>
    <a
      className="button button--sm button--secondary"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        cal.previous();
      }}
    >
      ← Previous
    </a>
    <a
      className="button button--sm button--secondary margin-left--xs"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        cal.next();
      }}
    >
      Next →
    </a>
    <div style={{ float: "right", fontSize: 11, marginTop: "5px" }}>
      Calm
      <div
        id="ex-stock-legend"
        style={{ display: "inline-block", margin: "0 8px" }}
      ></div>
      Busy
    </div>
  </div>
);
