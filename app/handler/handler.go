package handler

import (
	"log"
	"montask/app/models"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

//ログインに関係するハンドラー
func Register(c echo.Context) error {
	user := new(models.User)
	if err := c.Bind(user); err != nil {
		log.Println(err)
		return c.String(500, "error")
	}

	if user.Email == "" {
		return c.String(500, "error")
	}

	if err := user.CreateUser(); err != nil {
		log.Println(err)
		return c.String(500, "error")
	}

	getUser, _ := models.GetUserByEmail(user.Email)

	return c.JSON(http.StatusOK, getUser.ID)
}

func Login(c echo.Context) error {
	postUser := new(models.User)
	if err := c.Bind(postUser); err != nil {
		log.Println(err)
	}

	user, err := models.GetUserByEmail(postUser.Email)
	if err != nil {
		log.Println(err)
		return c.String(500, "error")
	}

	return c.JSON(http.StatusOK, user.ID)
}

func Logout(c echo.Context) error {
	return c.JSON(http.StatusOK, "ok")
}

func GetUserEmail(c echo.Context) error {
	userId, _ := strconv.Atoi(c.FormValue("id"))
	user, _ := models.GetUserById(userId)
	return c.JSON(http.StatusOK, user.Email)
}

//タスクに関するハンドラー
func CreateTasks(c echo.Context) error {
	taskName := c.FormValue("title")
	categoryName := c.FormValue("name")
	userId, _ := strconv.Atoi(c.FormValue("userId"))

	user, _ := models.GetUser(userId)

	task := models.Task{
		Title:     taskName,
		StartTime: time.Now(),
	}

	category, err := models.GetCategoryByCategoryName(userId, categoryName)
	if err != nil && categoryName != "" {
		err := models.CreateCategory(categoryName, userId)
		if err != nil {
			log.Println(err)
		}
		category, _ = models.GetCategoryByCategoryName(userId, categoryName)
	}

	err = models.CreateTask(task.Title, userId, category.ID)
	if err != nil {
		log.Println(err)
		return c.String(500, "error")
	}
	task, _ = user.GetTaskByStatusTrue()
	task.Category = category

	return c.JSON(http.StatusOK, task)
}

func GetTasks(c echo.Context) error {
	userId, _ := strconv.Atoi(c.FormValue("userId"))

	user, _ := models.GetUser(userId)
	task, _ := user.GetTaskByStatusTrue()
	tasks, _ := user.GetTasksByUser()

	categories, _ := user.GetCategoriesByUserID()
	for i, _ := range tasks {
		category, _ := models.GetCategory(tasks[i].CategoryID)
		category.Categories = categories
		tasks[i].Category = category
		subTime := tasks[i].CalculateSub()
		tasks[i].SubTime = time.Duration(subTime.Seconds())
	}
	category, _ := models.GetCategory(task.CategoryID)
	task.Categories = categories
	task.Tasks = tasks
	task.Category = category

	return c.JSON(http.StatusOK, task)
}

func StopTask(c echo.Context) error {
	taskName := c.FormValue("title")
	categoryName := c.FormValue("name")
	userId, _ := strconv.Atoi(c.FormValue("userId"))

	user, _ := models.GetUser(userId)
	task, _ := user.GetTaskByStatusTrue()
	category, _ := models.GetCategoryByCategoryName(userId, categoryName)
	task.Title = taskName
	task.CategoryID = category.ID
	task.Status = false
	task.EndTime = time.Now()
	err := task.UpdateTask()
	if err != nil {
		log.Println(err)
	}

	return c.JSON(http.StatusOK, nil)
}

func DeleteTask(c echo.Context) error {
	taskId, _ := strconv.Atoi(c.FormValue("taskId"))

	task, _ := models.GetTask(taskId)
	err := task.DeleteTask()
	if err != nil {
		log.Println(err)
		return c.JSON(500, "error")
	}

	return c.JSON(http.StatusOK, "ok")
}

//タスクのアップデートに関するハンドラー
func UpdateTask(c echo.Context) error {
	taskName := c.FormValue("taskTitle")
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)
	task.Title = taskName

	err := task.UpdateTask()
	if err != nil {
		log.Println(err)
	}

	return c.JSON(http.StatusOK, "ok")
}

func UpdateTaskCategory(c echo.Context) error {
	id, _ := strconv.Atoi(c.FormValue("id"))
	categoryId, _ := strconv.Atoi(c.FormValue("category_id"))

	task, _ := models.GetTask(id)
	task.CategoryID = categoryId

	err := task.UpdateTask()
	if err != nil {
		log.Println(err)
	}

	return c.JSON(http.StatusOK, "ok")
}

//時間の更新に関する関数
func UpdateTaskFromDuration(c echo.Context) error {
	hour, _ := strconv.Atoi(c.FormValue("hour"))
	minute, _ := strconv.Atoi(c.FormValue("minute"))
	second, _ := strconv.Atoi(c.FormValue("second"))
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)

	task.EndTime = (task.StartTime).Add(time.Duration(hour) * time.Hour)
	task.EndTime = (task.EndTime).Add(time.Duration(minute) * time.Minute)
	task.EndTime = (task.EndTime).Add(time.Duration(second) * time.Second)

	err := task.UpdateTask()
	if err != nil {
		log.Println(err)
	}

	return c.JSON(http.StatusOK, "ok")
}
func UpdateTaskFromStart(c echo.Context) error {
	hour, _ := strconv.Atoi(c.FormValue("hour"))
	minute, _ := strconv.Atoi(c.FormValue("minute"))
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)
	task.StartTime = time.Date(
		task.StartTime.Year(),
		time.Month(task.StartTime.Month()),
		task.StartTime.Day(),
		hour,
		minute,
		0, 0, time.Local)

	if task.StartTime.After(task.EndTime) {
		task.StartTime = task.StartTime.Add(-24 * time.Hour)
	}

	_ = task.UpdateTask()

	return c.JSON(http.StatusOK, "ok")
}
func UpdateTaskFromEnd(c echo.Context) error {
	hour, _ := strconv.Atoi(c.FormValue("hour"))
	minute, _ := strconv.Atoi(c.FormValue("minute"))
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)
	task.EndTime = time.Date(
		task.StartTime.Year(),
		time.Month(task.StartTime.Month()),
		task.StartTime.Day(),
		hour,
		minute,
		0, 0, time.Local)

	if task.EndTime.Before(task.StartTime) {
		task.EndTime = task.EndTime.Add(24 * time.Hour)
	}

	_ = task.UpdateTask()

	return c.JSON(http.StatusOK, "ok")
}

func UpdateTaskFromDate(c echo.Context) error {
	date := c.FormValue("date")
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)
	dates := strings.Split(date, "-")
	year, _ := strconv.Atoi(dates[0])
	month, _ := strconv.Atoi(dates[1])
	day, _ := strconv.Atoi(dates[2])

	subtime := task.CalculateSub()

	task.StartTime = time.Date(year, time.Month(month), day, task.StartTime.Hour(), task.StartTime.Minute(), task.StartTime.Second(), 0, time.Local)

	task.EndTime = task.StartTime
	task.EndTime = task.EndTime.Add(subtime)

	err := task.UpdateTask()
	if err != nil {
		log.Println(err)
		return c.JSON(500, "error")
	}

	return c.JSON(http.StatusOK, "ok")
}

func UpdateRunTask(c echo.Context) error {
	id, _ := strconv.Atoi(c.FormValue("id"))

	task, _ := models.GetTask(id)

	task.EndTime = time.Now().Local()
	_ = task.UpdateTask()

	return c.JSON(http.StatusOK, "ok")
}

//カテゴリーの編集に関する関数
func ChangeCategoryName(c echo.Context) error {
	name := c.FormValue("name")
	categoryID, _ := strconv.Atoi(c.FormValue("categoryID"))

	category, err := models.GetCategory(categoryID)
	if err != nil {
		log.Println(err)
		return c.JSON(500, "error")
	}
	category.Name = name

	_ = category.UpdateCategory()

	return c.JSON(http.StatusOK, "ok")
}
func ChangeCategoryColor(c echo.Context) error {
	colorID, _ := strconv.Atoi(c.FormValue("colorID"))
	categoryID, _ := strconv.Atoi(c.FormValue("categoryID"))

	category, err := models.GetCategory(categoryID)
	if err != nil {
		log.Println(err)
		return c.JSON(500, "error")
	}
	category.ColorID = colorID

	_ = category.UpdateCategory()

	return c.JSON(http.StatusOK, "ok")
}

func DeleteCategory(c echo.Context) error {
	id, _ := strconv.Atoi(c.FormValue("id"))
	category, err := models.GetCategory(id)
	if err != nil {
		log.Println(err)
		return c.JSON(500, "error")
	}

	_ = category.DeleteCategory()

	return c.JSON(http.StatusOK, "ok")
}

func CreateCategory(c echo.Context) error {
	userID, _ := strconv.Atoi(c.FormValue("userID"))
	colorID, _ := strconv.Atoi(c.FormValue("colorID"))
	name := c.FormValue("name")

	_ = models.CreateCategoryFromList(name, userID, colorID)

	return c.JSON(http.StatusOK, "ok")
}
