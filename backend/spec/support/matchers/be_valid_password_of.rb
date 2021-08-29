# expect('password').to be_valid_password_of user
RSpec::Matchers.define :be_valid_password_of do |user|
  match do |password|
    user.valid_password? password
  end
end
