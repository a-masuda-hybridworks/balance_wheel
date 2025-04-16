import React, { useRef, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Slider,
  TextField,
  Typography,
  Container,
  Grid,
  Button,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const colorSets = {
  current: {
    backgroundColor: "rgba(54, 124, 190, 0.4)",
    borderColor: "rgba(54, 124, 190, 1)"
  },
  future: {
    backgroundColor: "rgba(76, 175, 80, 0.4)",
    borderColor: "rgba(76, 175, 80, 1)"
  }
};

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const RadarChartComparison: React.FC = () => {
  const [categories, setCategories] = useState([
    "仕事・キャリア", "お金・経済", "健康", "家族・パートナー",
    "人間関係", "学び・自己啓発", "遊び・余暇", "物理的環境"
  ]);
  const [currentValues, setCurrentValues] = useState(new Array(8).fill(5));
  const [currentText, setCurrentText] = useState(new Array(8).fill(""));
  const [futureValues, setFutureValues] = useState(new Array(8).fill(5));
  const [futureText, setFutureText] = useState(new Array(8).fill(""));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (values: number[], setValues: (v: number[]) => void, index: number, newValue: number) => {
    const newArr = [...values];
    newArr[index] = newValue;
    setValues(newArr);
  };

  const handleTextChange = (texts: string[], setTexts: (t: string[]) => void, index: number, value: string) => {
    const newArr = [...texts];
    newArr[index] = value;
    setTexts(newArr);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCats = [...categories];
    newCats[index] = value;
    setCategories(newCats);
  };

  const addCategory = () => {
    setCategories([...categories, "新しいカテゴリ"]);
    setCurrentValues([...currentValues, 5]);
    setCurrentText([...currentText, ""]);
    setFutureValues([...futureValues, 5]);
    setFutureText([...futureText, ""]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
    setCurrentValues(currentValues.filter((_, i) => i !== index));
    setCurrentText(currentText.filter((_, i) => i !== index));
    setFutureValues(futureValues.filter((_, i) => i !== index));
    setFutureText(futureText.filter((_, i) => i !== index));
  };

  const data = (label: string, values: number[], color: any) => ({
    labels: categories,
    datasets: [
      {
        label,
        data: values,
        ...color,
        borderWidth: 1
      }
    ]
  });

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10
      }
    }
  };

  const savePDF = () => {
    if (printRef.current) {
      html2canvas(printRef.current, { useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "landscape" });
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`バランスホイール_${getFormattedDate()}.pdf`);
        setSnackbarOpen(true);
      });
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("バランスホイール");

    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { useCORS: true });
      const dataUrl = canvas.toDataURL("image/png");

      const image = workbook.addImage({
        base64: dataUrl,
        extension: "png"
      });

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;

      worksheet.addImage(image, {
        tl: { col: 0, row: 0 },
        ext: { width: imageWidth * 0.75, height: imageHeight * 0.75 }
      });
    }

    const dataStartRow = 47;

    worksheet.columns = [
      { header: "カテゴリ", key: "category", width: 20 },
      { header: "現在の満足度", key: "currentValue", width: 15 },
      { header: "現在のコメント", key: "currentComment", width: 30 },
      { header: "未来の満足度", key: "futureValue", width: 15 },
      { header: "未来のコメント", key: "futureComment", width: 30 }
    ];

    const headerRow = worksheet.getRow(dataStartRow);
    worksheet.columns.forEach((col, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = col.header as string;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCE5FF' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.commit();

    categories.forEach((cat, i) => {
      const row = worksheet.insertRow(dataStartRow + 1 + i, {
        category: cat,
        currentValue: currentValues[i],
        currentComment: currentText[i],
        futureValue: futureValues[i],
        futureComment: futureText[i]
      });

      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `バランスホイール_${getFormattedDate()}.xlsx`);
    setSnackbarOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2 }}>バランスホイール（現在と未来の比較）</Typography>

      <div ref={printRef}>
        <Grid container spacing={4}>
          {[{
            title: "現在のバランスホイール",
            values: currentValues,
            texts: currentText,
            setValues: setCurrentValues,
            setTexts: setCurrentText,
            color: colorSets.current
          }, {
            title: "未来のバランスホイール",
            values: futureValues,
            texts: futureText,
            setValues: setFutureValues,
            setTexts: setFutureText,
            color: colorSets.future
          }].map((chart, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Typography variant="h6" align="center" gutterBottom>{chart.title}</Typography>
              <Radar data={data(chart.title, chart.values, chart.color)} options={options} />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {categories.map((cat, idx) => (
                  <Grid item xs={12} key={idx} container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        value={cat}
                        onChange={(e) => handleCategoryChange(idx, e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Slider
                        size="small"
                        value={chart.values[idx]}
                        max={10}
                        min={1}
                        onChange={(_, newVal) => handleSliderChange(chart.values, chart.setValues, idx, newVal as number)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        multiline
                        size="small"
                        value={chart.texts[idx]}
                        onChange={(e) => handleTextChange(chart.texts, chart.setTexts, idx, e.target.value)}
                        placeholder="コメントや説明"
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton onClick={() => removeCategory(idx)}><Delete /></IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={addCategory}>カテゴリを追加</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="outlined" onClick={savePDF}>PDFとして保存する</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={exportToExcel}>Excelとして保存する</Button>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">保存しました！</Alert>
      </Snackbar>
    </Container>
  );
};

export default RadarChartComparison;