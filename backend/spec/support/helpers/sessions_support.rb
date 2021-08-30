module SessionsSupport
  def login_as(user)
    post api_v1_auth_login_path, params: {
      user: { email: user.email, password: user.password }
    }
  end
end
