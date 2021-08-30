class Api::V1::Auth::RegistrationsController < Api::V1::ApplicationController
  before_action :require_authentication, only: [:update, :destroy]
  before_action :require_no_authentication, only: :create

  # POST /api/v1/auth/sign_up
  def create
    user = User.new(user_params)

    if user.save
      sign_in user
      render json: { data: user }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :bad_request
    end
  end

  # PATCH /api/v1/auth/registrations
  def update
    params = user_params

    # 現在のパスワードが入力されていない
    unless params[:current_password]
      render json: { message: '現在のパスワードを入力してください' }, status: :bad_request
      return
    end

    # 現在のパスワードが不正
    unless current_user.valid_password?(params[:current_password])
      render json: { message: '現在のパスワードが間違っています'}, status: :bad_request
      return
    end

    params.delete(:current_password)

    if current_user.update_without_password(params)
      render json: { data: current_user }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :bad_request
    end
  end

  # DELETE /api/v1/auth/registrations
  def destroy
    if current_user.destroy
      sign_out current_user
      render json: { message: 'アカウントを削除しました' }, status: :ok
    else
      render json: { error: 'アカウントの削除に失敗しました' }, status: :bad_request
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar, :current_password)
  end
end
