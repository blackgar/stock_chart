import { useEffect, useState } from "react";
import styled from "styled-components";
import Candle from "./components/chart/candle";
import Volume from "./components/chart/volume";

function App() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const today = `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
  const [size, setSize] = useState();
  const [name, setName] = useState("SM C&C");
  const [count, setCount] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(today);
  const [chartData, setChartData] = useState([]);
  const [dataLength, setDataLength] = useState();
  // const { width, height } = size;

  // wheelEvent 구현예정
  const dataWheelHandler = () => {
    window.onwheel = (e) => {
      e.deltaY > 0
        ? setDataLength(dataLength < 18 ? dataLength : dataLength - 8)
        : setDataLength(dataLength > count ? dataLength : dataLength + 8);
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/ticker/chart/048550?date=${startDate}&count=${count}`
    )
      .then((res) => res.json())
      .then((res) => {
        setChartData(res.payload);
        setDataLength(res.payload.length);
      })
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (chartData) console.log(chartData);
  }, [chartData]);

  return (
    <>
      {isLoading ? (
        <>Loading</>
      ) : (
        <Container>
          <Candle
            width={size.width}
            height={size.height}
            count={count}
            dataLength={dataLength}
            name={name}
            chartData={chartData}
          />
          <Volume
            width={size.width}
            height={size.height}
            count={count}
            dataLength={dataLength}
            name={name}
            chartData={chartData}
          />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
export default App;
