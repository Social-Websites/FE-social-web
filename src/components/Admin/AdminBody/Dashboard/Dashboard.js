import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import classNames from "classnames/bind";
import styles from "../PageBody.scss";
import PageHeader from "../Common/PageHeader/PageHeader";
import { CardGraph } from "../Common/Graph/GraphComponent";
import {
  ArrayDataGenerator,
  randomValueGenerator,
} from "../../../../shared/util/ArrayDataGenerator";
import {
  amber,
  blue,
  green,
  indigo,
  lightGreen,
  red,
} from "@mui/material/colors";
import UserOverview from "./UserOverview";
import usePrivateHttpClient from "../../../../shared/hook/http-hook/private-http-hook";

const cx = classNames.bind(styles);

const DashboardBody = () => {
  const privateHttpClient = usePrivateHttpClient();
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {}, []);

  return (
    <Box>
      <PageHeader label="Dashboard" pageTitle="Quick Overview" />

      <Grid container spacing={1}>
        {displayData.map((item, i) => (
          <Grid key={i} item xs={6} sm={3}>
            <Card>
              <CardContent className={cx("card-content")}>
                <CardGraph
                  id={item.graphCardInfo.id}
                  data={item.graphCardInfo.data}
                  brColor={item.graphCardInfo.brColor}
                  bgColor={item.graphCardInfo.bgColor}
                  className={cx("display-card-graph")}
                />
                <Typography variant="body2" className={cx("card-label")}>
                  {item.label}
                </Typography>
                <Typography
                  variant="h5"
                  component="h6"
                  className={cx("card-title")}
                >
                  {item.value}
                </Typography>
                <Typography
                  component="p"
                  style={{ textAlign: "center", marginBottom: "0px" }}
                >
                  <Button
                    size="small"
                    className={cx("ratio-btn")}
                    startIcon={item.icon}
                    style={{
                      color:
                        item.graphCardInfo.id[4] === "u" ||
                        item.graphCardInfo.id[4] === "p"
                          ? green[600]
                          : red[500],
                    }}
                  >
                    {item.iconLabel}
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <UserOverview />
    </Box>
  );
};

export default DashboardBody;
