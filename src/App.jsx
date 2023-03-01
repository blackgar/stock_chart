import { useEffect, useState } from "react";
import styled from "styled-components";
import Candle from "./components/chart/candle";
import Volume from "./components/chart/volume";
import { collectData } from "./utils/collectData";

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
  const [candleData, setCandleData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [dataLength, setDataLength] = useState();
  // const { width, height } = size;

  // wheelEvent 구현예정
  const dataWheelHandler = () => {
    window.onwheel = (e) => {
      e.deltaY > 0
        ? setDataLength(dataLength < 18 ? dataLength : dataLength - 8)
        : setDataLength(
            dataLength > candleData.length - 18 ? dataLength : dataLength + 8
          );
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
        setCandleData(res.payload.reverse());
        setVolumeData(res.payload.map((v, i) => v.volume));
        setDataLength(res.payload.length - 50);
      })
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (candleData) {
      // console.log(candleData);
      // console.log(volumeData);
    }
  }, [candleData]);
  // console.log(dataLength, candleData.length);
  return (
    <>
      {isLoading ? (
        <>Loading</>
      ) : (
        <Container onWheel={dataWheelHandler}>
          <Candle
            width={size.width}
            height={size.height}
            count={count}
            dataLength={dataLength}
            name={name}
            candleData={candleData}
          />
          <Volume
            width={size.width}
            height={size.height}
            count={count}
            dataLength={dataLength}
            name={name}
            volumeData={volumeData}
          />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* background-color: #000211; */
  color: white;
`;

export default App;
