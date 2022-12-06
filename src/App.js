import "./App.css";
import { useState } from "react";
import securityicon from "./security-icon.webp";
import { ethers } from "ethers";
import { getTokenDetails } from "./Utils/getABI.js";
import { Loader, Center } from "@mantine/core";
import { inputDataDecoder } from "./Utils/eventDecoder.mjs";

export default function KnownDecoder(props) {
  const [decodedData, setDecodedData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [decodeDataError, setDecodeDataError] = useState(null);
  const [possibleData, setPossibleData] = useState([]);
  const [currentInterface, setCurrentInterface] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decodedData2, setDecodedData2] = useState([]);
  const [currentData2, setCurrentData2] = useState(null);
  const [decodeDataError2, setDecodeDataError2] = useState(null);
  const [possibleData2, setPossibleData2] = useState([]);

  const [loading2, setLoading2] = useState(false);

  let chains = {
    Ethereum: 1,
    Polygon: 137,
    Bsc: 56,
    Avalanche: 43114,
    Arbitrum: 42161,
    Optimism: 10,
  };

  const r = document.querySelector(":root");

  async function addPossibleData(event) {
    event.preventDefault();
    let contractABI;

    try {
      setLoading(true);
      setPossibleData([]);
      setDecodedData([]);
      setDecodeDataError(null);

      console.log(
        event.target.contractAddress.value,
        event.target.chainId.value,
        chains[event.target.chainId.value]
      );

      contractABI = await getTokenDetails(
        event.target.contractAddress.value,
        event.target.chainId.value,
        chains[event.target.chainId.value]
      );

      console.log(contractABI);
      const newInterface = new ethers.utils.Interface(contractABI);
      console.log(newInterface);
      setCurrentInterface(newInterface);

      const res = await fetch(
        `https://www.4byte.directory/api/v1/signatures/?hex_signature=${ethers.utils.hexDataSlice(
          event.target.data.value,
          0,
          4
        )}`
      );
      const resp = res;
      const response = JSON.parse(await resp.text());
      console.log(response.results);

      if (response.results?.length > 0) {
        let newArr = [];
        for (let i = 0; i < response.results.length; i++) {
          if (response.results[i].text_signature in newInterface.functions) {
            newArr.push(response.results[i]);
          }
        }
        setPossibleData(newArr);
        console.log(newArr);
        console.log(newArr.length);
        if (!newArr.length) {
          setDecodeDataError("Function not found in chosen contract address");
        }
      } else {
        setDecodeDataError("Function type not recognized");
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setDecodedData([]);
      setPossibleData([]);
      setDecodeDataError(err.message);
    }
  }

  async function addPossibleData2(event) {
    event.preventDefault();

    try {
      setLoading2(true);
      setPossibleData2([]);
      setDecodedData2([]);
      setDecodeDataError2(null);

      const res = await fetch(
        `https://www.4byte.directory/api/v1/signatures/?hex_signature=${ethers.utils.hexDataSlice(
          event.target.data2.value,
          0,
          4
        )}`
      );
      const resp = res;
      const response = JSON.parse(await resp.text());
      console.log(response.results);

      if (response.results?.length > 0) {
        let newArr = [];
        for (let i = 0; i < response.results.length; i++) {
          // if (response.results[i].text_signature in newInterface.functions) {
          newArr.push(response.results[i]);
          // }
        }
        setPossibleData2(newArr);
        console.log(newArr);
        console.log(newArr.length);
        if (!newArr.length) {
          setDecodeDataError2("Function not found in chosen contract address");
        }
      } else {
        setDecodeDataError2("Function type not recognized");
      }
      setLoading2(false);
    } catch (err) {
      console.log(err.message);
      setLoading2(false);
      setDecodedData2([]);
      setPossibleData2([]);
      setDecodeDataError2(err.message);
    }
  }

  async function decodeData(params) {
    try {
      setDecodeDataError(null);

      let decodedInfo;

      decodedInfo = currentInterface.decodeFunctionData(
        possibleData[params.index].text_signature,
        params.data
      );

      let r = Object.keys(decodedInfo);
      let xxxxx = [];
      let f = {};

      for (let i = 0; i < decodedInfo.length; i++) {
        xxxxx.push({
          varName: r[decodedInfo.length + i],
          value: decodedInfo[i],
        });
      }

      console.log(xxxxx);
      setDecodedData(xxxxx);
      setCurrentData(possibleData[params.index].text_signature);
    } catch (err) {
      setDecodedData([]);

      setDecodeDataError(err.message);
    }
  }

  async function decodeData2(params) {
    try {
      setDecodeDataError2(null);

      let decodedInfo;

      decodedInfo = await inputDataDecoder({
        textSignature: possibleData2[params.index].text_signature,
        data: params.data,
      });

      console.log(decodedInfo);
      let r = Object.keys(decodedInfo);
      console.log(r);
      let xxxxx = [];
      let f = {};

      for (let i = 0; i < decodedInfo.length; i++) {
        xxxxx.push({
          varName: r[i],
          value: decodedInfo[i],
        });
      }

      console.log(xxxxx);
      setDecodedData2(xxxxx);
      setCurrentData2(possibleData2[params.index].text_signature);
    } catch (err) {
      setDecodedData2([]);

      setDecodeDataError2(err.message);
    }
  }

  function data() {
    r.style.setProperty("--logDecoder", "none");
    r.style.setProperty("--dataDecoder", "block");

    r.style.setProperty("--choice4BoxShadow", "none");

    r.style.setProperty(
      "--choice3BoxShadow",
      ` rgba(0, 0, 0, 0.2) 0 10px 10px -1px,
      rgba(0, 0, 0, 0.14) 0 20px 30px 0, rgba(0, 0, 0, 0.12) 0 10px 30px 0`
    );
    r.style.setProperty("--choice4Pix", "0.5px");
    r.style.setProperty("--choice3Pix", "1px");
  }

  function logs() {
    r.style.setProperty("--logDecoder", "block");
    r.style.setProperty("--dataDecoder", "none");

    r.style.setProperty("--choice3BoxShadow", "none");
    r.style.setProperty(
      "--choice4BoxShadow",
      ` rgba(0, 0, 0, 0.2) 0 10px 10px -1px,
      rgba(0, 0, 0, 0.14) 0 20px 30px 0, rgba(0, 0, 0, 0.12) 0 10px 30px 0`
    );
    r.style.setProperty("--choice3Pix", "0.5px");
    r.style.setProperty("--choice4Pix", "1px");
  }

  const Dec = (params) => {
    console.log(params);

    const tempTotal = [];

    try {
      let decodedInfo = params.arr;

      let r = Object.keys(decodedInfo);

      for (let i = 0; i < decodedInfo.length; i++) {
        tempTotal.push({
          varName: r[decodedInfo.length + i],
          value: decodedInfo[i],
        });
      }

      console.log(tempTotal);
    } catch (err) {
      console.log(err.message);
    }
    return (
      <div
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          textAlign: "left",
        }}
      >
        {tempTotal.map((value, index) => (
          <div style={{ marginTop: "2em", marginBottom: "2em" }}>
            {value.value?._isBigNumber ? (
              <div>
                {" "}
                <a style={{ color: "blue", fontWeight: "bolder" }}>
                  {value.varName
                    ? params.baseName + "." + value.varName + " : "
                    : params.baseName + "[" + index + "]" + " : "}
                </a>
                {value.value.toString()}
              </div>
            ) : (
              <div>
                {" "}
                {JSON.stringify(value.value).startsWith("[") ? (
                  <div>
                    <Dec
                      arr={value.value}
                      baseName={
                        value.varName
                          ? params.baseName + "." + value.varName
                          : params.baseName + "[" + index + "]"
                      }
                    />
                  </div>
                ) : (
                  <div>
                    {" "}
                    <a style={{ color: "blue", fontWeight: "bolder" }}>
                      {value.varName
                        ? params.baseName + "." + value.varName + " : "
                        : params.baseName + "[" + index + "]" + " : "}
                    </a>
                    {value.value === true || value.value === false ? (
                      <> {value.value.toString()} </>
                    ) : (
                      <> {value.value} </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={securityicon} style={{ width: "2.7em", height: "2.7em" }} />
          <h1 style={{ marginLeft: "0.5em" }}> EVM DATA </h1>
        </div>
        <div className="line" />
      </header>
      <h5>
        Created by{" "}
        <a
          href="https://twitter.com/AmadiMichaels"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "black 1px" }}
        >
          @AmadiMichaels{" "}
        </a>
        and open source{" "}
        <a
          href="https://github.com/AmadiMichaels/evm-data"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "black 1px" }}
        >
          here
        </a>
      </h5>
      <h6> Don't trust, VERIFY!</h6>

      <h1> EVM Data Decoder </h1>
      <div
        style={{
          margin: "0 3em 0 3em",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      >
        {" "}
        The detailed decoder lets you specify the chain, contract address and
        input data you wish to decode, and displays a detailed decoded
        information with the name of each input and its corresponding decoded
        value from the input data This is particularly helpful for complex
        transaction data with many arguments and nested structures and arrays.
        it lets you visualize it individually.
        <p /> The instant decoder is faster and lets you see the decoded value
        from the input data but only correspondingto the index of the argument.
        This can be used to confirm the inputs of simply transactions with few
        arguments and for chains not yet supported{" "}
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "3em",
          }}
        >
          {" "}
          <div>
            <p />
            <button className="choice3" onClick={data}>
              {" "}
              DETAILED DECODER
            </button>
          </div>
          <div>
            <p />
            <button className="choice4" onClick={logs}>
              {" "}
              INSTANT DECODER{" "}
            </button>
          </div>
        </div>
      </div>
      <p />
      <div className="formBox">
        <div className="dataDecoder">
          <form onSubmit={addPossibleData}>
            <h2>DECODE TRANSACTION INPUT DATA</h2>
            <label for="contractAddress"> Contract Address </label> <br />
            <input
              type="text"
              placeholder="Contract Address"
              id="contractAddress"
            />{" "}
            <p />
            <label for="chainId"> CHAIN ID </label> <br />
            <select
              className="etherUnit"
              id="chainId"
              style={{ width: "250px", height: "30px", padding: "0" }}
            >
              <option> Choose a network/chain</option>
              <option value="Ethereum">Ethereum Mainnet</option>
              <option value="Polygon">Polygon Mainnet</option>
              <option value="Bsc">Binance Smart Chain</option>
              <option value="Avalanche">Avalanche C Chain</option>
              <option value="Arbitrum">Arbitrum One</option>
              <option value="Optimsim">Optimism</option>
            </select>{" "}
            <p />
            <p />
            <label for="data"> INPUT DATA </label> <br />
            <input type="text" placeholder="Input data" id="data" /> <p />
            <div>
              <p />
              <button type="submit"> Get possible functions </button>
            </div>
          </form>

          <div>
            {loading ? (
              <div className="loader" style={{ marginTop: "2em" }}>
                <Center>
                  <Loader mt={15} color="black" />
                </Center>

                <h1>Decoding... </h1>
              </div>
            ) : null}
          </div>

          <div>
            {possibleData.length > 0 ? (
              <div>
                <div
                  className="line"
                  style={{
                    marginTop: "2em",
                  }}
                />
                {possibleData.map((value, index) => (
                  <div
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      marginTop: "2em",
                    }}
                  >
                    {value.text_signature} {"  "}
                    <p />
                    <button
                      onClick={() => {
                        decodeData({
                          data: document.getElementById("data").value,
                          index: index,
                        });
                      }}
                    >
                      {" "}
                      Decode Data{" "}
                    </button>{" "}
                    <p />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {decodedData.length > 0 ? (
              <div
                style={{
                  marginTop: "4em",
                }}
              >
                <div
                  className="line"
                  style={{
                    marginTop: "2em",
                  }}
                />
                <h3> DECODED INPUT DATA</h3>
                Function name
                <p
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontWeight: "bolder",
                  }}
                >
                  {" "}
                  {currentData.split("(")[0]}{" "}
                </p>
                <div className="line" />
                <div
                  style={{
                    marginBottom: "1em",
                    marginTop: "3em",
                  }}
                />
                <div
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "left",
                    // marginBottom: "1em",
                    // marginTop: "1em",
                  }}
                >
                  {decodedData.map((value, index) => (
                    <div style={{ marginTop: "2em", marginBottom: "2em" }}>
                      {value.value?._isBigNumber ? (
                        <div>
                          {" "}
                          <a style={{ color: "blue", fontWeight: "bolder" }}>
                            {value.varName + " : "}
                          </a>
                          {value.value.toString()}
                        </div>
                      ) : (
                        <div>
                          {" "}
                          {JSON.stringify(value.value).startsWith("[") ? (
                            <div>
                              <Dec
                                arr={value.value}
                                baseName={
                                  value.varName
                                    ? value.varName
                                    : "[" + index + "]"
                                }
                              />
                            </div>
                          ) : (
                            <div>
                              {" "}
                              <a
                                style={{ color: "blue", fontWeight: "bolder" }}
                              >
                                {value.varName + " : "}
                              </a>
                              {value.value === true || value.value === false ? (
                                <> {value.value.toString()} </>
                              ) : (
                                <> {value.value} </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {decodeDataError ? (
            <div
              style={{
                marginTop: "1em",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              {" "}
              {decodeDataError}{" "}
            </div>
          ) : null}
        </div>

        <div className="logDecoder">
          <form onSubmit={addPossibleData2}>
            <h2>DECODE TRANSACTION INPUT DATA</h2>
            <p />
            <label for="data"> INPUT DATA </label> <br />
            <input type="text" placeholder="Input data" id="data2" /> <p />
            <div>
              <p />
              <button type="submit"> Get possible functions </button>
            </div>
          </form>

          <div>
            {loading2 ? (
              <div className="loader" style={{ marginTop: "2em" }}>
                <Center>
                  <Loader mt={15} color="black" />
                </Center>

                <h1>Decoding... </h1>
              </div>
            ) : null}
          </div>

          <div>
            {possibleData2.length > 0 ? (
              <div>
                <div
                  className="line"
                  style={{
                    marginTop: "2em",
                  }}
                />
                {possibleData2.map((value, index) => (
                  <div
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      marginTop: "2em",
                    }}
                  >
                    {value.text_signature} {"  "}
                    <p />
                    <button
                      onClick={() => {
                        decodeData2({
                          data: document.getElementById("data2").value,
                          index: index,
                        });
                      }}
                    >
                      {" "}
                      Decode Data{" "}
                    </button>{" "}
                    <p />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {decodedData2.length > 0 ? (
              <div
                style={{
                  marginTop: "4em",
                }}
              >
                <div
                  className="line"
                  style={{
                    marginTop: "2em",
                  }}
                />
                <h3> DECODED INPUT DATA</h3>
                Function name
                <p
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontWeight: "bolder",
                  }}
                >
                  {" "}
                  {currentData2.split("(")[0]}{" "}
                </p>
                <div className="line" />
                <div
                  style={{
                    marginBottom: "1em",
                    marginTop: "3em",
                  }}
                />
                <div
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "left",
                    // marginBottom: "1em",
                    // marginTop: "1em",
                  }}
                >
                  {decodedData2.map((value, index) => (
                    <div style={{ marginTop: "2em", marginBottom: "2em" }}>
                      {value.value?._isBigNumber ? (
                        <div>
                          {" "}
                          <a style={{ color: "blue", fontWeight: "bolder" }}>
                            {value.varName + " : "}
                          </a>
                          {value.value.toString()}
                        </div>
                      ) : (
                        <div>
                          {" "}
                          {JSON.stringify(value.value).startsWith("[") ? (
                            <div>
                              <Dec
                                arr={value.value}
                                baseName={
                                  value.varName
                                    ? value.varName
                                    : "[" + index + "]"
                                }
                              />
                            </div>
                          ) : (
                            <div>
                              {" "}
                              <a
                                style={{ color: "blue", fontWeight: "bolder" }}
                              >
                                {value.varName + " : "}
                              </a>
                              {value.value === true || value.value === false ? (
                                <> {value.value.toString()} </>
                              ) : (
                                <> {value.value} </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {decodeDataError2 ? (
            <div
              style={{
                marginTop: "1em",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              {" "}
              {decodeDataError2}{" "}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
