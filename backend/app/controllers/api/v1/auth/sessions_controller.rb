class Api::V1::Auth::SessionsController < Api::V1::ApplicationController
  # POST /api/v1/auth/login
  def create
    user = User.find_for_database_authentication(email: user_param[:email])

    if user.nil?
      return render json: { errors: { message: 'アカウントが見つかりませんでした' } }, status: :not_found
    end

    if user.valid_password?(user_param[:password])
      sign_in :user, user
      render json: { data: user }, status: :ok
    else
      render json: { errors: { message: 'アドレスまたはパスワードが違います' } }, status: :unauthorized
    end
  end

  # DELETE /api/v1/auth/logout
  def destroy
    sign_out current_user
    render json: { message: 'ログアウトしました' }, status: :ok
  end

  private
  def user_param
    params.require(:user).permit(:email, :password)
  end
end
