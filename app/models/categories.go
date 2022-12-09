package models

import (
	"log"
	"time"
)

type Category struct {
	ID         int        `json:"id"`
	Name       string     `json:"name"`
	ColorID    int        `json:"color_id"`
	UserID     int        `json:"user_id"`
	CreatedAt  time.Time  `json:"created_at"`
	Categories []Category `json:"categories"`
}

func GetCategoryByCategoryName(userId int, name string) (category Category, err error) {
	cmd := `select id, name, color_id, user_id, created_at from categories where user_id = ? and name = ?`

	err = Db.QueryRow(cmd, userId, name).Scan(
		&category.ID,
		&category.Name,
		&category.ColorID,
		&category.UserID,
		&category.CreatedAt)

	if err != nil {
		log.Println(err)
	}

	return category, err
}

func CreateCategory(name string, userId int) (err error) {
	cmd := `insert into categories (
		name,
		color_id,
		user_id,
		created_at) values (?, ?, ?, ?)`

	_, err = Db.Exec(cmd, name, 11, userId, time.Now())
	if err != nil {
		log.Println(err)
	}

	return err
}
func CreateCategoryFromList(name string, userId int, colorId int) (err error) {
	cmd := `insert into categories (
		name,
		color_id,
		user_id,
		created_at) values (?, ?, ?, ?)`

	_, err = Db.Exec(cmd, name, colorId, userId, time.Now())
	if err != nil {
		log.Println(err)
	}

	return err
}

func GetCategory(id int) (category Category, err error) {
	cmd := `select id, name, color_id, user_id, created_at from categories where id = ?`

	err = Db.QueryRow(cmd, id).Scan(
		&category.ID,
		&category.Name,
		&category.ColorID,
		&category.UserID,
		&category.CreatedAt)

	return category, err
}

func (u *User) GetCategoriesByUserID() (categories []Category, err error) {
	cmd := `select id, name, color_id, user_id, created_at from categories where user_id = ?`
	rows, err := Db.Query(cmd, u.ID)
	if err != nil {
		log.Println(err)
	}

	for rows.Next() {
		var category Category
		err = rows.Scan(
			&category.ID,
			&category.Name,
			&category.ColorID,
			&category.UserID,
			&category.CreatedAt)

		if err != nil {
			log.Println(err)
		}

		categories = append(categories, category)
	}

	rows.Close()

	return categories, err
}

func (c *Category) UpdateCategory() (err error) {
	cmd := `update categories set name = ?, color_id = ? where id = ?`
	_, _ = Db.Exec(cmd, c.Name, c.ColorID, c.ID)
	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func (c *Category) DeleteCategory() (err error) {
	cmd := `delete from categories where id = ?`
	_, err = Db.Exec(cmd, c.ID)
	if err != nil {
		log.Println(err)
	}

	return err
}
