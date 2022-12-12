package main

import (
	"montask/app/handler"
	"montask/app/models"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	models.InitDB()

	e := echo.New()

	//CORSの設定(vueのプロジェクトをGOで立てたlocalサーバーで起動する時は不要)
	e.Use(middleware.CORS())

	// e.Static("/", "dist/")

	//サインイン、ログイン、ログアウトに関するHandler
	e.POST("/signup", handler.Register)
	e.POST("/login", handler.Login)
	e.GET("/logout", handler.Logout)

	// リクエストに対するHandler
	e.POST("/getUserEmail", handler.GetUserEmail)
	e.POST("/post", handler.CreateTasks)
	e.POST("/getTasks", handler.GetTasks)
	e.POST("/stopTask", handler.StopTask)
	e.POST("/deleteTask", handler.DeleteTask)

	//タスクのアップデートに関するハンドラー
	e.POST("/updateTask", handler.UpdateTask)
	e.POST("/updateTaskCategory", handler.UpdateTaskCategory)
	e.POST("/updateTaskFromDuration", handler.UpdateTaskFromDuration)
	e.POST("/updateTaskFromStart", handler.UpdateTaskFromStart)
	e.POST("/updateTaskFromEnd", handler.UpdateTaskFromEnd)
	e.POST("/updateTaskFromDate", handler.UpdateTaskFromDate)
	e.POST("/updateRunTask", handler.UpdateRunTask)

	// カテゴリーの作成、編集に関するハンドラー
	e.POST("/updateCategoryName", handler.ChangeCategoryName)
	e.POST("/updateColor", handler.ChangeCategoryColor)
	e.POST("/deleteCategory", handler.DeleteCategory)
	e.POST("/createCategory", handler.CreateCategory)

	//グラフに関するハンドラー

	// local サーバー
	e.Logger.Fatal(e.Start(":8000"))
}
