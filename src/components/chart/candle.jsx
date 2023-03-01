import { scaleLinear } from "d3-scale";
import { useEffect } from "react";
import styled from "styled-components";

const Candle = ({ width, height, count, dataLength, name, candleData }) => {
  let chartWidth = typeof width === "number" ? width * 1 : 0;
  let chartHeight = typeof height === "number" ? height * 0.5 : 0;
  const xForPrice = 75;
  const xAxisLength = chartWidth - xForPrice;
  const yAxisLength = chartHeight * 0.94;
  const x0 = 0;
  const y0 = 0;

  const chartData = candleData?.slice(dataLength, candleData.length);

  const maxPrice = chartData.reduce(
    (max, data) => Math.max(max, data.high),
    -Infinity
  );
  const minPrice = chartData.reduce(
    (min, data) => Math.min(min, data.low),
    +Infinity
  );

  const dataYRange = maxPrice - minPrice;
  const numYTicks = 7;
  const barPlotWidth = xAxisLength / chartData.length;

  const numXTicks = 12;
  const xValue = [];
  for (let i = 0; i < 12; i++) {
    xValue.push(
      chartData[Math.round(chartData.length / 12) * i]?.date.slice(0, 10)
    );
  }
  console.log(xValue);
  return (
    <Wrapper>
      <svg width={chartWidth} height={chartHeight}>
        <line
          x1={x0}
          y1={yAxisLength}
          x2={xAxisLength}
          y2={yAxisLength}
          stroke="gray"
        />
        <line
          x1={xAxisLength}
          y1={y0}
          x2={xAxisLength}
          y2={yAxisLength}
          stroke="gray"
        />
        <text
          x={x0 + 15}
          y={y0 + yAxisLength * 0.06}
          fontSize={chartWidth > 700 ? chartWidth * 0.01 : chartWidth * 0.02}
        >
          {name}
        </text>
        {/* 세로선 작성 */}
        {Array.from({ length: numXTicks }).map((_, index) => {
          const x = x0 + index * (xAxisLength / numXTicks) + 10;

          return (
            <g key={index}>
              <line
                className="lineLight"
                x1={x}
                x2={x}
                y1={yAxisLength}
                y2={y0}
              ></line>
              <text
                x={x}
                y={chartHeight}
                textAnchor="middle"
                fontSize={chartWidth < 800 ? 6 : 10}
              >
                {xValue[index]}
              </text>
            </g>
          );
        })}
        {/* 가로선 작성(css name => lineLight) */}
        {Array.from({ length: numYTicks }).map((_, index) => {
          const y = y0 + index * (yAxisLength / numYTicks);
          const yValue = Math.round(
            maxPrice - index * (dataYRange / numYTicks)
          );
          return (
            <g key={index}>
              <line
                className="lineLight"
                x1={xAxisLength}
                x2={x0}
                y1={y}
                y2={y}
              ></line>
              <text x={chartWidth - 60} y={y + 10} fontSize="12">
                {yValue.toLocaleString()}
              </text>
            </g>
          );
        })}
        {/* 캔들 구현 */}
        {chartData.map((v, index) => {
          // 캔들 & 이동평균선
          const x = x0 + index * barPlotWidth;
          const xX = x0 + (index + 1) * barPlotWidth;
          const sidePadding = xAxisLength * 0.0015;
          const max = Math.max(v.open, v.close);
          const min = Math.min(v.open, v.close);
          const scaleY = scaleLinear()
            .domain([minPrice, maxPrice])
            .range([y0, yAxisLength]);
          const fill = v.close > v.open ? "#4AFA9A" : "#E33F64";
          return (
            <g key={index}>
              <line
                x1={x + (barPlotWidth - sidePadding) / 2}
                x2={x + (barPlotWidth - sidePadding) / 2}
                y1={yAxisLength - scaleY(v.low)}
                y2={yAxisLength - scaleY(v.high)}
                stroke={v.open > v.close ? "red" : "green"}
              />
              <rect
                {...{ fill }}
                x={x}
                width={barPlotWidth - sidePadding}
                y={yAxisLength - scaleY(max)}
                // 시가 종가 최대 최소값의 차
                height={scaleY(max) - scaleY(min)}
              ></rect>
            </g>
          );
        })}
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: white;
`;

export default Candle;
