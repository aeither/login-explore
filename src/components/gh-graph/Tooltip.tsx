"use client";
import React from "react";

type TooltipState = { x: number; y: number; label: string; hidden: boolean };

export default class Tooltip extends React.Component {
  state: TooltipState;
  constructor(props: object) {
    super(props);
    this.state = { x: 0, y: 0, label: "", hidden: true };
  }

  setPosition(nstate: Partial<TooltipState>) {
    this.setState({ ...this.state, ...nstate });
  }

  render() {
    if (this.state.hidden) return null;
    const { x: left, y: top, label } = this.state;

    return (
      <span className="tooltip" style={{ top, left }}>
        {label}
      </span>
    );
  }
}
