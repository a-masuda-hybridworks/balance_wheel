import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Box,
  Alert,
} from "@mui/material";

const Header = () => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openUsage, setOpenUsage] = useState(false);

  const handleOpenAbout = () => {
    setOpenAbout(true);
  };

  const handleCloseAbout = () => {
    setOpenAbout(false);
  };

  const handleOpenUsage = () => {
    setOpenUsage(true);
  };

  const handleCloseUsage = () => {
    setOpenUsage(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", mb: 2 }}>
      <Toolbar>
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL}/02_01_logo.svg`}
          alt="ロゴ"
          sx={{ height: 40 }}
        />
        <Button
          variant="outlined"
          sx={{ color: "#333", borderColor: "#333", marginLeft: "auto" }}
          onClick={handleOpenAbout}
        >
          バランスホイールとは？
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#333", borderColor: "#333", ml: 1 }}
          onClick={handleOpenUsage}
        >
          ツールの利用方法
        </Button>
      </Toolbar>

      {/* バランスホイールとはダイアログ */}
      <Dialog open={openAbout} onClose={handleCloseAbout}>
        <DialogTitle>バランスホイールとは？</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
          バランスホイールとは、自分の人生に対して評価をつけ、自分が何に満足しているか、何に不満を持っているかを認識するためのツールです。<br /><br />
            自己評価や目標設定の際に活用されることがあります。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAbout} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      {/* ツールの使い方ダイアログ */}
      <Dialog open={openUsage} onClose={handleCloseUsage}>
        <DialogTitle>ツールの利用方法</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              画面を下にスクロールしたところに入力項目があります。<br />
              各項目に対して<strong>満足度</strong>と、<strong>現在の状態および未来の状態目標</strong>などを書きましょう。
              記入すると自動的に画面上部に表示がされます。<br /><br />
              作成が完了したら「PDFとして保存する」もしくは「Excelとして保存する」から保存しておきましょう。
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                使用上のヒント
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">
                  PCからご利用ください。
                </Typography>
                <Typography component="li" variant="body2">
                  画面をリロードすると、入力した内容がリセットされます（タブ移動は問題ありません）。
                </Typography>
                <Typography component="li" variant="body2">
                  入力された情報は利用者側のブラウザ上で一時的に保存されるだけで、運営側では一切保存しておりません。安心してご利用ください。
                </Typography>
              </Box>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUsage} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;