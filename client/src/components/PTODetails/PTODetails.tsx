import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import "./PTODetails.css";
import { dayStatus } from "common/constants";
import { IUserHolidayBasicInfo, IUserInfo, HolidayDays } from "common/types";
import DatesCalculator from "components/common/DatesCalculator/DatesCalculator";
import Error from "components/common/Error/Error";
import PTOBasicInfo from "components/PTODetails/PTOBasicInfo/PTOBasicInfo";
import { IHolidaysService, IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface PTODetailsMatchProps {
  id: string;
}

interface PTODetailsProps extends RouteComponentProps<PTODetailsMatchProps> {}

interface PTODetailsState {
  error: string;
  loading: boolean;
  PTOInfo: IUserHolidayBasicInfo;
  employee: IUserInfo;
  approvers: Array<IUserInfo>;
  eachDayStatus: HolidayDays;
  workingDays: number;
}

class PTODetails extends Component<PTODetailsProps, PTODetailsState> {
  @resolve(TYPES.Holidays) holidaysService!: IHolidaysService;
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: PTODetailsProps) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      employee: {
        id: "",
        googleId: "",
        email: "",
        firstName: "",
        lastName: "",
        picture: "",
      },
      PTOInfo: {
        id: "",
        from_date: "",
        to_date: "",
        comment: "",
        status: "",
      },
      approvers: [],
      eachDayStatus: [],
      workingDays: 0,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const PTOId = this.props.match.params.id;
      const PTOFullInfo = await this.PTOService.PTODetailed(PTOId);
      const workingDays = this.calculateWorkingDays(PTOFullInfo.eachDayStatus);

      this.setState({
        employee: PTOFullInfo.employee,
        PTOInfo: {
          id: PTOFullInfo.id,
          from_date: PTOFullInfo.from_date,
          to_date: PTOFullInfo.to_date,
          comment: PTOFullInfo.comment,
          status: PTOFullInfo.status,
        },
        approvers: PTOFullInfo.approvers,
        eachDayStatus: PTOFullInfo.eachDayStatus,
        workingDays,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
    this.setState({
      loading: false,
    });
  }
  render(): JSX.Element {
    if (this.state.error) {
      return <Error />;
    }
    return (
      <div className="pto-details-container">
        <h1 className="pto-details-header">View Vacation</h1>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {this.state.loading ? (
              <CircularProgress />
            ) : (
              <PTOBasicInfo
                employee={this.state.employee}
                approvers={this.state.approvers}
                PTOInfo={this.state.PTOInfo}
                workingDays={this.state.workingDays}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator loading={this.state.loading} holidayDaysStatus={this.state.eachDayStatus} />
          </Grid>
        </Grid>
      </div>
    );
  }

  private calculateWorkingDays(daysStatuses: HolidayDays): number {
    return daysStatuses.filter((el) => el.status === dayStatus.workday).length;
  }
}

export default PTODetails;
