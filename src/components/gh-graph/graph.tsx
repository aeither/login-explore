import "./styles.css";
import React, { createRef } from "react";
import { SID } from "./config";
import Tooltip from "./Tooltip";

type ActivityGraphProps = {
  data: { time: number; value: number }[];
  maxValue?: number;
  weeks?: number;
  label?: string;
  className?: string;
};

export default function ActivityGraph(props: ActivityGraphProps) {
  const { data, weeks = 24, className, label = "{date}: {value}" } = props;
  const startTime = getLastMonday(Date.now() - weeks * SID * 7).getTime();
  const maxValue =
    props.maxValue ?? Math.max(...data.map((item) => item.value));
  const tooltipRef = createRef<Tooltip>();

  function handleMouseLeave() {
    tooltipRef.current &&
      tooltipRef.current.setPosition({ x: 0, y: 0, label: "", hidden: true });
  }

  function renderCol(r: number, ci: number) {
    const i = ci + r * 7;
    const iStartTime = i * SID + startTime;
    const iEndTime = SID + iStartTime;
    const date = new Date(iStartTime);
    const item = data.find(
      (item) => item.time >= iStartTime && item.time < iEndTime,
    );
    const tooltip = label
      .replaceAll(
        "{date}",
        date.toLocaleString("us", {
          month: "short",
          day: "2-digit",
          weekday: "short",
          year: "numeric",
        }),
      )
      .replaceAll("{value}", String(item?.value ?? 0));

    function handleMouseEnter(ev: React.MouseEvent<HTMLSpanElement>) {
      const bound = ev.currentTarget.getBoundingClientRect();
      tooltipRef.current &&
        tooltipRef.current.setPosition({
          x: bound.x,
          y: bound.y,
          label: tooltip,
          hidden: false,
        });
      ev.preventDefault();
      ev.stopPropagation();
    }

    return (
      <span
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseLeave}
        // title={label}
        className="row"
        key={`k-${i}`}
      >
        {item && (
          <span
            style={{
              opacity: item.value / maxValue,
              filter: `brightness(${1.5 - item.value / maxValue})`,
            }}
          />
        )}
      </span>
    );
  }

  function renderRow(_: unknown, r: number) {
    return (
      <div className="col" key={`r-${r}`}>
        {new Array(7).fill(0).map((ci, i) => renderCol(r, i))}
      </div>
    );
  }
  return (
    <>
      <div
        onMouseLeave={handleMouseLeave}
        className={`container ${className ?? ""}`}
      >
        {new Array(weeks).fill(0).map(renderRow)}
      </div>
      <Tooltip ref={tooltipRef} />
    </>
  );
}

function getLastMonday(time: string | number | Date) {
  const date = new Date(time);

  // start on Sunday
  date.setDate(date.getDate() - date.getDay());
  date.setHours(0, 0, 0, 0);
  return date;
}
