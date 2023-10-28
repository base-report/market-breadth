import { expect, test, describe } from "bun:test";
import { parseAndExtract } from "../src/fmp/profiles";

const data = `
"Symbol","Price","Beta","VolAvg","MktCap","LastDiv","Range","Changes","companyName","currency","cik","isin","cusip","exchange","exchangeShortName","industry","website","description","CEO","sector","country","fullTimeEmployees","phone","address","city","state","zip","DCF_diff","DCF","image","ipoDate","defaultImage","isEtf","isActivelyTrading","isFund","isAdr"
"WFIVX",25.38,1,0,0,0.252,"22.22-27.12",0.29,"Wilshire 5000 Index Fund Investment Class","USD","0000890453",,,"NASDAQ","NASDAQ",,,"The investment seeks to replicate as closely as possible the performance of the Wilshire 5000 Index SM before the deduction of index fund expenses.  The fund invests at least 80% of its assets in the equity securities of companies included in the index that are representative of the index. The managers may use enhanced âstratified samplingâ techniques in an attempt to replicate the performance of the index. The fund normally holds stocks representing at least 90% of the total market value of the index.","","",,,"866-591-1568","Wilshire Mutual Funds Inc",,,,,0,"https://financialmodelingprep.com/image-stock/WFIVX.png","1999-01-29",true,false,true,true,false
"AAPL",177.49,1.286802,58373334,2774914078484,0.96,"124.17-198.23",2.58,"Apple Inc.","USD","0000320193","US0378331005","037833100","NASDAQ Global Select","NASDAQ","Consumer Electronics","https://www.apple.com","Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. In addition, the company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; AirPods Max, an over-ear wireless headphone; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, HomePod, and iPod touch. Further, it provides AppleCare support services; cloud services store services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. Additionally, the company offers various services, such as Apple Arcade, a game subscription service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.","Mr. Timothy D. Cook","Technology","US","164000","408 996 1010","One Apple Park Way","Cupertino","CA","95014",4.15176,150.082,"https://financialmodelingprep.com/image-stock/AAPL.png","1980-12-12",false,false,true,false,false
`;

describe("parseAndExtract", () => {
  test("extracts a stock with the valid exchange", () => {
    const result = parseAndExtract(data);
    expect(result).toStrictEqual([
      {
        symbol: "AAPL",
        exchange: "NASDAQ",
        sector: "Technology",
        industry: "Consumer Electronics",
        delisted: false,
      },
    ]);
  });
});
