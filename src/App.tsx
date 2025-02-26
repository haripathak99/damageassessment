/* eslint-disable no-constant-condition */
// @ts-nocheck

import {
  ChangeEventHandler,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import type { Map } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import Slider from "@mui/material/Slider";
import OpacityControl from "maplibre-gl-opacity";
import NaxaLogo from "./assets/Naxa_logo.png";
import WelcomeMsg from "./Components/Welcomemsg";
import FileUpload from "./Components/common/FileUpload";
import { dataRequest } from "./store/actions/project";
import {
  selectError,
  selectLoading,
  selectdataData,
} from "./store/slices/project";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "lucide-react";
import tfile from "./assets/tryitout.png";

export default function App() {
  const dateFormattedForOutput = new Date();
  const mapContainerRef = useRef(null);
  const map = useRef<Map>(new Map());
  const [activeLayer, setActiveLayer] = useState([]);
  const [drawState, setDrawState] = useState(null);
  const [bbox, setBbox] = useState(null);
  const [currentState, setCurrentState] = useState();
  const [value, setValue] = useState<number[]>([20, 20]);
  const [tileUrl, setTileUrl] = useState<string>(
    "https://janakpur.dmaps.org/api/v1/raster-tiles/{z}/{x}/{y}.png?raster_id=1"
  );
  const [tileValue, setTileValue] = useState<string>(
    "https://janakpur.dmaps.org/api/v1/raster-tiles/{z}/{x}/{y}.png?raster_id=1"
  );
  const [outputFolder, setOutputFolder] = useState<string>(
    `${dateFormattedForOutput.getDate()}${
      dateFormattedForOutput.getMonth() + 1
    }${dateFormattedForOutput.getFullYear()}${dateFormattedForOutput.getHours()}${dateFormattedForOutput.getMinutes()}${dateFormattedForOutput.getSeconds()}`
  );

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [fileUp, setFileUp] = useState("");
  const [tileToggle, setTileToggle] = useState(true);
  const hiddenFileInput = useRef(null);
  const [valueOpacity, setValueOpacity] = useState<number>(30);

  const handleChangeOpacity = (event: Event, newValue: number | number[]) => {
    setValueOpacity(newValue as number);
  };

  const fileData = useSelector(selectdataData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const tileLoadFunction = (url: string) => {
    return function (tile: any, callback: any) {
      // Custom logic for tile loading if needed
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          tile.src = objectUrl;
          callback();
        })
        .catch((error) => {
          console.error("Tile loading error:", error);
          callback(error);
        });
    };
  };

  useEffect(() => {
    if (!map.current) return;
    if (!mapContainerRef?.current) return;
    map.current = new maplibregl.Map({
      container: mapContainerRef.current, // container id
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      // style: "https://demotiles.maplibre.org/style.json", // style URL
      center: [85.91866948778498, 26.720885910238067], // starting position [lng, lat]
      zoom: 16, // starting zoom
    });

    return () => {
      map.current?.remove();
    };
  }, [map]);
  // const onTileChange = (event: { target: { value: any } }) => {
  //   const value = event.target.value;
  //   if (!map?.current) return null;
  //   setTileValue(value);
  // };

  const handleClick = (layerName: string) => {
    if (activeLayer.includes(layerName)) {
      setActiveLayer((prevStrings) =>
        prevStrings.filter((s) => s !== layerName)
      );
    } else {
      setActiveLayer((prevStrings) => [...prevStrings, layerName]);
    }
  };

  function removeRasterLayer(map, sourceName, layerId) {
    if (map.current.getSource(sourceName)) {
      map.current.removeSource(sourceName);
    }
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
  }

  function addRasterLayer(
    map: MutableRefObject<Map>,
    sourceName: string,
    tileUrl: string,
    layerId: string,
    boundingbox: number[] = [-180, -85.051129, 180, 85.051129]
  ) {
    if (map.current.getSource(sourceName)) {
      map.current.removeSource(sourceName);
    }
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }

    map.current.addSource(sourceName, {
      type: "raster",
      tiles: [tileUrl],
      tileSize: 256,
      scheme: "xyz",
      minzoom: 10,
      maxzoom: 20,
      bounds: boundingbox,
      attribution:
        'Map tiles by <a target="_blank" href="http://naxa.com.np">Naxa</a>; Hosting by <a href="https://naxa.com.np/" target="_blank">Naxa</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
      tileLoadFunction: tileLoadFunction([tileUrl]),
    });

    map.current.addLayer({
      id: layerId,
      type: "raster",
      source: sourceName,
    });
  }

  function splitPolygon(Draw) {
    const features = Draw?.getAll();
    console.log(features, "features");

    if (features.features.length > 0) {
      const originalPolygon = features.features[0];
      const bbox = turf.bbox(originalPolygon);
      console.log(bbox, "bbox");
      setBbox(bbox);
    }
  }

  const handleTile = () => {
    setTileUrl(tileValue);
    setTileToggle(true);
    setFileUp("");
    if (tileValue === "") return setTileUrl("smth");
    console.log(fileName, "Nammememe");
  };

  useEffect(() => {
    if (!map.current) return;

    map.current.on("load", () => {
      if (!map.current.getSource("satelliteLayer")) {
        addRasterLayer(
          map,
          "satelliteLayer_data",
          tileUrl,
          // "https://naxa.com.np/geoai/wastecoverageai/rastertile/{z}/{x}/{y}.png",
          "satelliteLayer_data"
        );
      }

      map?.current.on("error", (response: { error: { message: any } }) => {
        // console.log("Error: url is invalid", response.error.message);
        return;
      });
      // if (!map.current.getSource("contours")) {
      //   addRasterLayer(
      //     map,
      //     "contours",
      //     "https://naxa.com.np/geoai/wastecoverageai/wastetile/{z}/{x}/{y}.png",
      //     "contours-data"
      //   );
      // }
    });

    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });
    setDrawState(Draw);
    map?.current?.addControl(Draw, "top-left");

    map?.current?.on("draw.create", function (e) {
      console.log(e.features);
      const originalPolygon = e.features?.[e.features.length - 1];
      const bbox = turf.bbox(originalPolygon);
      console.log(bbox, "bbox");
      setBbox(bbox);
    });
    // map?.current?.on("style.load", () => {
    //   const mapOverLayer = {
    //     satelliteLayer_data: "satelliteLayer_data",
    //   };
    //   // OpacityControl
    //   const Opacity = new OpacityControl({
    //     overLayers: mapOverLayer,
    //     opacityControl: true,
    //   });
    //   map?.current?.addControl(Opacity, "top-right");
    // });
    // return () => {
    // map?.current?.removeControl(draw);
    // if (map.current.getLayer("contours-data")) {
    //   map.current.removeLayer("contours-data");
    // }
    // if (map.current.getSource("contours")) {
    //   map.current.removeSource("contours");
    // }
    // if (map.current.getLayer("satelliteLayer-data")) {
    //   map.current.removeLayer("satelliteLayer-data");
    // }
    // return () => {
    //   map?.current?.remove();
    // };
    // };
  }, [map]);

  const zoomLevel = [18, 20];
  const predictWithBbox = () => {
    splitPolygon(drawState);
    const payload = {
      baseUrl: tileUrl,
      bbox: bbox,
      input_folder: "tiles",
      output_folder: outputFolder,
      max_workers: 10,
      zoom_level: [zoomLevel[0], zoomLevel[1]],
    };

    fetch("https://damageassessmentapi.naxa.com.np/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    fetchPredictedTiles(outputFolder);
  };
  const fetchPredictedTiles = async (outputFolder) => {
    if (outputFolder) {
      while (true) {
        const checkTileResponse = await fetch(
          `https://damageassessmentapi.naxa.com.np/check/${outputFolder}`
        );
        const checkTileJson = await checkTileResponse.json();
        console.log(checkTileJson, "checkTileResponse");
        const status = checkTileJson[1];

        if (status === 202) {
          setCurrentState("Tiles are processing...");
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the sleep duration as needed
        } else if (status === 200) {
          setCurrentState(
            `Tiles are ready for download ${checkTileJson[0]["url"]}`
          );

          addRasterLayer(
            map,
            "predicted_rasterlayer",
            checkTileJson[0]["url"],
            "predicted_rasterlayer_data",
            bbox
          );
          const mapOverLayer = {
            satelliteLayer_data: "satelliteLayer_data",
            predicted_rasterlayer_data: "predicted_rasterlayer_data",
          };
          // OpacityControl
          const Opacity = new OpacityControl({
            overLayers: mapOverLayer,
            opacityControl: true,
          });
          map?.current?.addControl(Opacity, "top-right");
          break;
        } else {
          setCurrentState(`Error: Unexpected status ${status}`);
          break;
        }
      }
    }

    // Uncomment the code below if needed
    // try {
    //     createDownloadZip(outputFolder, "./output.zip", "example.zip");
    // } catch (error) {
    //     st.sidebar.error(`Error: ${error}`);
    // }
  };
  useEffect(() => {
    if (!map?.current) return null;
    if (typeof tileUrl === File) return null;
    const source = map?.current?.getSource("satelliteLayer_data");
    console.log(source, "source");
    if (source) {
      source?.setTiles([tileUrl]);
    }
  }, [tileUrl]);

  const handleUpload = (event: any) => {
    hiddenFileInput.current.click();
  };

  const handleChanged = (event: { target: { files: any[] } }) => {
    const fileUploadedName = event.target.files[0]?.name;
    const fileUploaded = event.target?.files[0];
    setFileName(fileUploadedName); // ADDED
    setFile(URL.createObjectURL(event.target.files[0]));
  };
  const onHandleTileValue = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setTileUrl(value);
  };

  const dispatch = useDispatch();
  const setFileUpload = () => {
    dispatch(dataRequest(file));
    setFileUp(file);
    setFileName(fileName);
    setTileToggle(false);
    console.log(file, "file checking");
    console.log(file, "file again checking");
  };

  return (
    <>
      <WelcomeMsg />

      <div className="flex main">
        <div className="sidebar max-w-[17rem] w-80 h-auto p-4 flex flex-col justify-between">
          <div className="">
            <div className="p-2">
              <p>Output Folder :</p>
              <input
                className="p-2 border-2 border-gray-600 rounded"
                type="text"
                onChange={(e) => {
                  setOutputFolder(e.target.value);
                }}
                value={outputFolder}
              />
            </div>
            <div className="p-2 ">
              <p>Tile Url:</p>
              <div className="flex items-center gap-2">
                <input
                  className=" w-44 h-10 p-2 border-2 border-gray-600 rounded"
                  type="text"
                  onChange={(e) => {
                    setTileValue(e.target.value);
                  }}
                  value={tileValue}
                />
                <button
                  className="bg-red-600 hover:bg-red-800 flex mx-auto p-2 text-white rounded-md"
                  type="submit"
                  onClick={handleTile}
                >
                  <Upload />
                </button>
              </div>
              <p className="text-center p-2">or</p>
              <div className="flex justify-around gap-2 pr-5">
                <button
                  className="border-2 border-gray-800 rounded-md px-4"
                  type="submit"
                  onClick={handleUpload}
                >
                  Choose File
                </button>
                <button
                  className="bg-red-600 hover:bg-red-800 p-2 text-white rounded-md disabled:bg-gray-400"
                  type="submit"
                  onClick={setFileUpload}
                  disabled={fileName === ""}
                >
                  Upload
                </button>
              </div>
              {file && !tileToggle && <p>{fileName}</p>}
              <input
                className="p-2 w-72"
                style={{ display: "none" }}
                type="file"
                onChange={handleChanged}
                ref={hiddenFileInput}
              />
            </div>
            <div className="p-2 mt-10 ">
              <p>Zoom Level Range to Predict</p>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                max={25}
                min={1}
                // getAriaValueText={valuetext}
              />
              <p>
                Zoom Level:{" "}
                <span>
                  {value[0]} - {value[1]}
                </span>
              </p>
            </div>

            <div className="flex justify-center">
              <button
                className="p-2 my-4 bg-red-600 text-white hover:bg-red-800 rounded"
                onClick={predictWithBbox}
              >
                Predict
              </button>
            </div>
            <h2>Status: {currentState}</h2>
            <div className="p-2">
              <p>Transparancy</p>
              <Slider
                aria-label="Volume"
                step={0.1}
                marks
                min={0.0}
                max={1.0}
                value={valueOpacity}
                onChange={handleChangeOpacity}
              />
              <p>
                value: <span>{valueOpacity}</span>
              </p>
            </div>
          </div>

          <div className="p-2">
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between">
                  <img width={135} src={NaxaLogo} alt="Naxa Logo" />
                  {/* <img
                  src={GeovationLogo}
                  className="max-h-12"
                  alt="Geovation Logo"
                /> */}
                </div>
              </div>
            </div>
            <p className="flex text-gray-700 text-xs text-justify ">
              Damage Assessment AI Powered Application by Naxa.
            </p>
          </div>
        </div>
        {fileUp && tileToggle === false && (
          <div className="bg-slate-500 w-full">
            <div className=" w-fit z-20 h-[100vh] mx-auto py-10 ">
              <img className="w-full object-cover h-full" src={fileUp} alt="" />
              <div className="absolute top-0">
                <div
                  className="relative w-fit z-20 h-[100vh] mx-auto py-10"
                  style={{ opacity: valueOpacity }}
                >
                  <img
                    className=" w-full object-cover h-full"
                    src={tfile}
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* <div className="absolute top-0">
              <div className="relative flex justify-center w-fit z-20 h-[100vh] mx-auto py-10 ">
                <img
                  className="w-full object-cover h-full"
                  src={fileUp}
                  alt=""
                />
              </div>
            </div> */}
          </div>
        )}
        <div ref={mapContainerRef} id={tileToggle ? `map` : ``} />

        {/* <div className="absolute flex flex-col top-0 right-0 p-4 w-auto h-auto ">
        <div>
          <div
            className={`heading flex items-center cursor-pointer w-full ${
              activeLayer.includes("satellite") ? "bg-orange-500" : "bg-black"
            } text-white bg-opacity-100 p-1 rounded-[50px] text-[16px] m-1`}
            onClick={() => handleClick("satellite")}
          >
            <img
              className="bg-white p-1 text-black rounded-[50px] text-[16px]"
              src="https://hwcw.naxa.com.np/7637ea1322b7cefe4eac307c47037080.png"
              alt="temperature"
              style={{ width: "30px" }}
            />
            <h5 className="ml-1 font-bold text-sm">Satellite</h5>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              splitPolygon(drawState);
            }}
          >
            splitPolygon
          </button>
        </div>
        <div>
          <div
            className={`heading flex items-center cursor-pointer w-full ${
              activeLayer.includes("waste") ? "bg-orange-500" : "bg-black"
            } text-white bg-opacity-100 p-1 rounded-[50px] text-[16px] m-1`}
            onClick={() => handleClick("waste")}
          >
            <img
              className="bg-white p-1 text-black rounded-[50px] text-[16px]"
              src="https://hwcw.naxa.com.np/7637ea1322b7cefe4eac307c47037080.png"
              alt="wind"
              style={{ width: "30px" }}
            />
            <h5 className="ml-1 font-bold text-sm">Waste Layer</h5>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
}
