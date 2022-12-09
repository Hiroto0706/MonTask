package models

import (
	"log"
	"time"
)

type Task struct {
	ID         int           `json:"id"`
	Title      string        `json:"title"`
	UserID     int           `json:"user_id"`
	CategoryID int           `json:"category_id"`
	Status     bool          `json:"status"`
	StartTime  time.Time     `json:"start_time"`
	EndTime    time.Time     `json:"end_time"`
	CreatedAt  time.Time     `json:"created_at"`
	Category   Category      `json:category`
	SubTime    time.Duration `json:"subtime"`
	Tasks      []Task        `json:"tasks"`
	Categories []Category    `json:"categories"`
}

func CreateTask(title string, userId int, categoryId int) error {
	cmd := `insert into tasks (
		title,
		user_id,
		category_id,
		status,
		start_time,
		end_time,
		created_at) values (?, ?, ?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd, title, userId, categoryId, 1, time.Now(), time.Now(), time.Now())
	if err != nil {
		log.Println(err)
	}

	return err
}

func GetTask(id int) (task Task, err error) {
	task = Task{}
	cmd := `select id, title, user_id, category_id, status, start_time, end_time, created_at from tasks where id = ?`
	err = Db.QueryRow(cmd, id).Scan(
		&task.ID,
		&task.Title,
		&task.UserID,
		&task.CategoryID,
		&task.Status,
		&task.StartTime,
		&task.EndTime,
		&task.CreatedAt)

	task.SubTime = task.CalculateSub()

	return task, err
}

func (u *User) GetTasksByUser() (tasks []Task, err error) {
	cmd := `select id, title, user_id, category_id, status, start_time, end_time, created_at from tasks where user_id = ? order by start_time desc`
	rows, err := Db.Query(cmd, u.ID)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var task Task
		err = rows.Scan(
			&task.ID,
			&task.Title,
			&task.UserID,
			&task.CategoryID,
			&task.Status,
			&task.StartTime,
			&task.EndTime,
			&task.CreatedAt)

		if err != nil {
			log.Println(err)
		}

		tasks = append(tasks, task)
	}
	rows.Close()

	return tasks, err
}

func (u *User) GetTaskByStatusTrue() (task Task, err error) {
	cmd := `select id, title, user_id, category_id, status, start_time, end_time, created_at from tasks where status = ? and user_id = ? order by created_at desc`

	_ = Db.QueryRow(cmd, 1, u.ID).Scan(
		&task.ID,
		&task.Title,
		&task.UserID,
		&task.CategoryID,
		&task.Status,
		&task.StartTime,
		&task.EndTime,
		&task.CreatedAt)

	return task, err
}

func (t *Task) UpdateTask() (err error) {
	cmd := `update tasks set title = ?, category_id = ?, status = ?, start_time = ?, end_time = ? where id = ?`
	_, _ = Db.Exec(cmd, t.Title, t.CategoryID, t.Status, t.StartTime, t.EndTime, t.ID)
	if err != nil {
		log.Fatalln(err)
	}

	return err
}

//時差を求める関数
func (t *Task) CalculateSub() (sub time.Duration) {
	t1 := t.StartTime
	t2 := t.EndTime
	sub = t2.Sub(t1)

	IntSub := int(sub)

	sub = time.Duration(IntSub)

	return sub
}

func (t *Task) DeleteTask() (err error) {
	cmd := `delete from tasks where id = ?`
	_, err = Db.Exec(cmd, t.ID)
	if err != nil {
		log.Fatalln(err)
	}

	return err
}
