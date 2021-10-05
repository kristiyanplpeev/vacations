import React from "react";

import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

import { DateUtil } from "common/DateUtil";
import { IUserAbsence, IUser } from "common/interfaces";
import font from "components/AbsenceDetails/PDFDocu/roboto-medium-webfont.ttf";

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 50,
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 150,
  },
  title: {
    fontSize: 18,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  underTitle: {
    fontSize: 12,
    fontWeight: "thin",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  names: {
    fontSize: 12,
    marginTop: 25,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  department: {
    fontSize: 12,
    marginTop: 15,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  message: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 15,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  view: {
    flexDirection: "row",
  },
  viewCol: {
    flexDirection: "column",
  },
  checkbox: {
    marginVertical: 5,
    marginLeft: 30,
    marginRight: 5,
    height: 12,
    width: 12,
  },
  article: {
    fontSize: 12,
    marginTop: 3,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  date: {
    fontSize: 12,
    marginTop: 25,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  employeeSignature: {
    fontSize: 12,
    marginTop: 25,
    marginLeft: 190,
    textAlign: "left",
    fontFamily: "Roboto",
  },
  managerSignature: {
    fontSize: 12,
    marginTop: 35,
    marginLeft: 190,
    textAlign: "left",
    fontFamily: "Roboto",
  },
});

Font.register({
  family: "Roboto",
  src: font,
});

const emptyBox = process.env.PUBLIC_URL + "/emptyBox.png";
const checkedBox = process.env.PUBLIC_URL + "/checkedBox.png";

interface MyDocumentProps {
  employee: IUser;
  absenceDetails: IUserAbsence;
  workingDays: number;
}

// Create Document Component
// eslint-disable-next-line max-lines-per-function
const MyDocument = (props: MyDocumentProps): JSX.Element => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.image} src={process.env.PUBLIC_URL + "/atscale-logo.png"} />
      <Text style={styles.title}>ЗАЯВЛЕНИЕ ЗА ПОЛЗВАНЕ НА ОТПУСК</Text>
      <Text style={styles.underTitle}>от</Text>
      <Text style={styles.names}>{`Имена: ${props.employee.firstName} ${props.employee.lastName}`}</Text>
      <Text style={styles.department}>Отдел: Engineering/ Front-end</Text>
      <Text
        style={styles.message}
      >{`Ще бъда в отпуск от ${props.absenceDetails.from_date} до ${props.absenceDetails.to_date}, общо ${props.workingDays} работни дни.`}</Text>
      <Text style={styles.message}>Моля да ми бъде разрешено да ползвам годишен отпуск:</Text>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={checkedBox} />
        <Text style={styles.article}>Платен отпуск по чл. 155 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={emptyBox} />
        <Text style={styles.article}>Неплатен отпуск по чл. 160 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={emptyBox} />
        <Text style={styles.article}>Сватба по чл. 157, т. 1 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={emptyBox} />
        <Text style={styles.article}>Кръводаряване по чл. 157, т. 2 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={emptyBox} />
        <Text style={styles.article}>В случай на смърт по чл. 157, т. 3 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Image style={styles.checkbox} src={emptyBox} />
        <Text style={styles.article}>Явяване в съда по чл. 157, т. 4 от КТ</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.date}>Дата: {`${DateUtil.todayStringified()}`}</Text>
        <View style={styles.viewCol}>
          <Text style={styles.employeeSignature}>Подпис на служителя:</Text>
          <Text style={styles.managerSignature}>Одобрение на мениджъра:</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
