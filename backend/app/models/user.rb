class User < ApplicationRecord
  has_many :rooms, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :favorites, dependent: :destroy

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  mount_uploader :avatar, AvatarUploader

  # Validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, length: { maximum: 250 },
                    format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }

  # パスワードが空でもユーザーを更新
  def update_without_password(user_params)
    if user_params[:password].blank? && user_params[:password_confirmation].blank?
      user_params.delete(:password) && user_params.delete(:password_confirmation)
    end

    clean_up_passwords

    update(user_params)
  end

  # コメントをお気に入りする
  def favorite(comment)
    favorites.create(comment: comment)
  end
end
