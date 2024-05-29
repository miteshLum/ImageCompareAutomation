import axios from "axios";
import React from "react";
// const jp = require("jsonpath");
// const fs = require("fs");

// const path = require("path");

const url = "https://lustrous-centaur-cb2a51.netlify.app/";
var csvWriterValueArray = [];

export async function getUID(link) {
  let cat = link + "data/categories.json";
  try {
    const uidArr = await axios.get(cat).then(async (response) => {
      const jsonVal = response.data;
      console.log("JSON VVV => ", jsonVal);
      const failureReasons = jsonVal.children[0].children.map((value) => value.name);
      let uidArray = [];
      if (failureReasons.length > 0) {
        const indexArray = await returnIndex(failureReasons);
        for (let i = 0; i < indexArray.length; i++) {
          let tempList = jsonVal.children[0].children[`${indexArray[i]}`].children.map((val) => val.uid);
          for (let j = 0; j < tempList.length; j++) {
            uidArray.push(tempList[j]);
          }
        }
      }
      return uidArray;
    });
    return uidArr;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function returnIndex(arr) {
  let indArray = [];
  await arr.forEach(function (element, index) {
    if (element.includes("Image")) indArray.push(index);
  });
  return indArray;
}

export async function getAttachmentList(uidArray, link) {
  // console.log("UID => ", uidArray);
  // const attList = new Map();
  const attList = [];
  for (let i = 0; i < uidArray.length; i++) {
    let attURL = `${link}data/test-cases/${uidArray[i]}.json`;
    try {
      await axios.get(attURL).then(async (response) => {
        const jsonVal = response.data;
        const attachmentList = jsonVal.testStage.attachments;
        const testName = jsonVal.name;
        let obj = {
          testName: testName,
          attachmentList: attachmentList,
        };
        attList.push(obj);
        // console.log("Attachment List => ", attachmentList);
        // console.log("Test Name => ", attList);
      });
    } catch (error) {
      console.log(error);
      // return false;
    }
  }
  // console.log("Attach => ", attList);
  return attList;
}

export async function getAllAttachmentImages(attMap) {
  const allImageCompareArr = [];

  // for (let entry of attMap.entries()) {
  //   let tc = entry[0];
  //   let testCaseName = tc.split("@")[0].trim();
  //   let mpObjArray = entry[1];
  //   let imglist = mpObjArray.filter((att) => att.type == "image/png");
  //   console.log("Image LIst => ", attMap.entries());
  //   for (let i = 0; i < imglist.length; i++) {
  //     let attURL = `${url}data/attachments/${imglist[i].source}`;
  //     console.log("Att URL => ", testCaseName, " ====> ", imglist[i].source);
  //     let obj = {
  //       testName: testCaseName,
  //       imageName: imglist[i].name,
  //       imageLink: attURL,
  //     };
  //     allImageCompareArr.push(obj);
  //   }
  // }
  return allImageCompareArr;
}

// export async function downloadAttachment(attMap) {
//   for (let entry of attMap.entries()) {
//     let tc = entry[0];
//     let testCaseName = tc[0].split("@")[0].trim();
//     let mpObjArray = entry[1];
//     let imglist = mpObjArray.filter((att) => att.type == "image/png");

//     for (let i = 0; i < imglist.length; i++) {
//       let attURL = `${url}data/attachments/${imglist[i].source}`;
//       let config = {
//         method: "get",
//         maxBodyLength: Infinity,
//         url: `${attURL}`,
//         headers: {},
//         responseType: "stream",
//       };
//       try {
//         const response = await axios.request(config);
//         const imgData = response.data;
//         const folderPath = Path.resolve(__dirname, "screenshots", testCaseName);
//         if (fs.existsSync(folderPath) === false) {
//           await fs.mkdirSync(folderPath);
//         }
//         const path = Path.resolve(folderPath, `${imglist[i].name}.png`);
//         const writer = fs.createWriteStream(path);
//         imgData.pipe(writer);
//       } catch (error) {
//         console.log(error);
//         return false;
//       }
//     }
//   }
// }

export async function st(link) {
  const uidArray = await getUID(link);
  const att = await getAttachmentList(uidArray, link);
  // console.log("ATTAChMENT => ", att);
  // const arr = await getAllAttachmentImages(att);
  return att;
}

export async function getAllModules(link) {
  // const suiteURL = link + "data/suites.json";
  const moduleData = await axios.get("https://image-compare-automation-server.vercel.app/api/allmodules").then(async (response) => {
    const allModules = response.data;
    console.log("Response => ", response);
    return allModules;
  });
  return moduleData;
}

export async function getAttList(uidArray, link) {
  // console.log("UID => ", uidArray);
  // const attList = new Map();
  const attList = [];
  for (let i = 0; i < uidArray.length; i++) {
    let attURL = `${link}data/test-cases/${uidArray[i]}.json`;
    try {
      await axios.get(attURL).then(async (response) => {
        const jsonVal = response.data;
        if (jsonVal.statusMessage.includes("Image")) {
          const attachmentList = jsonVal.testStage.attachments;
          const testName = jsonVal.name;
          console.log("test => ", jsonVal);
          let obj = {
            testName: testName,
            attachmentList: attachmentList,
          };
          attList.push(obj);
        }
        // console.log("Attachment List => ", attachmentList);
        // console.log("Test Name => ", attList);
      });
    } catch (error) {
      console.log(error);
      // return false;
    }
  }
  // console.log("Attach => ", attList);
  return attList;
}

export async function readAllScenario(uid, link) {
  csvWriterValueArray = [];
  for (let i = 0; i < uid.length; i++) {
    let attURL = `${link}data/test-cases/${uid[i]}.json`;
    try {
      await axios.get(attURL).then(async (response) => {
        const jsonVal = response.data;
        let scenarioName = jsonVal.name.toString();
        scenarioName = scenarioName.includes("@") == true ? scenarioName.split("@")[0].trim() : scenarioName.trim();
        const featureName = jsonVal.fullName.toString().split(":.")[0];
        const testStatus = jsonVal.status;
        if (testStatus === "failed") {
          const testStage = jsonVal.testStage;
          await getStepsattachment(testStage, featureName, scenarioName);
        }
      });
    } catch (error) {
      console.log(error);
      // return false;
    }
  }
  return csvWriterValueArray;
}

async function getStepsattachment(testStageObj, featureName, scenarioName) {
  await getStepArray(testStageObj, featureName, scenarioName);
}

async function getStepArray(testStageArrayobj, featureName, scenarioName) {
  // Attachment is executed
  await getAttachmentvalue(testStageArrayobj, featureName, scenarioName);
  // Check whether the object contains steps //iterate the stpes
  if (testStageArrayobj.steps.length !== 0) {
    for (let eachSteps of testStageArrayobj.steps) {
      await getStepArray(eachSteps, featureName, scenarioName);
    }
  }
}

async function getAttachmentvalue(attachementObj, featureName, scenarioName) {
  const attachMentvalue = attachementObj.attachments;
  // console.log("Attachment Val => ", attachMentvalue);
  if (Array.isArray(attachMentvalue) && attachMentvalue.length) {
    for (const i of attachMentvalue) {
      // console.log("i => ", i);
      const attachmentType = i.type;
      //TO GET IMAGE ATTACHMENT
      if (attachmentType.includes("image/")) {
        const fileType = attachmentType.replace("/png", "");
        const nameOfFile = i.name;

        const sourceOfFile = i.source;

        let finalFilename = "";
        if (nameOfFile.toString().endsWith("_base")) {
          finalFilename = removeLastStringfromScreenshotFile(nameOfFile, "_base");
        } else if (nameOfFile.toString().endsWith("_actual") && !nameOfFile.includes("-diff_")) {
          finalFilename = removeLastStringfromScreenshotFile(nameOfFile, "_actual");
        }

        if (nameOfFile.toString().endsWith("_actual") && !nameOfFile.includes("-diff_")) {
          const removeLastTwoItems = attachMentvalue.slice(0, -2);
          let getAllImage = removeLastTwoItems.reduce((acc, cur, index) => {
            if (cur.name.toString().endsWith("_base")) {
              const fn = removeLastStringfromScreenshotFile(cur.name, "_base");
              if (fn === finalFilename) {
                acc.base = cur.source;
                acc.baseFileName = cur.name;
              }
            } else if (cur.name.toString().endsWith("_actual") && !cur.name.includes("-diff_")) {
              const fn = removeLastStringfromScreenshotFile(cur.name, "_actual");
              if (fn === finalFilename) {
                acc.actual = cur.source;
                acc.actualFileName = cur.name;
              }
            } else if (cur.name.includes("-diff_")) {
              const fn = cur.name.split("-diff_")[0];
              if (fn === finalFilename) {
                acc.diff = cur.source;
                acc.diffFileName = cur.name;
              }
            }
            return acc;
          }, {});

          const imageObj = new Object();
          imageObj.FileType = fileType;
          imageObj.FeatureName = featureName;
          imageObj.ScenarioName = scenarioName;
          imageObj.FileName = finalFilename;
          imageObj.IsExpected = "False";
          imageObj.source = getAllImage;
          csvWriterValueArray.push(imageObj);
        }
      }
    }
  }
}

function removeLastStringfromScreenshotFile(str, typeOffolder) {
  const lastIndex = str.lastIndexOf(typeOffolder);
  if (lastIndex === -1 || lastIndex !== str.length - typeOffolder.length) {
    return str;
  }
  const trimmed = str.slice(0, lastIndex);
  return trimmed;
}
