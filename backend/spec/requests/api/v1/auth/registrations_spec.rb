require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  let(:tom) { create(:tom) }
  let(:user_params) { attributes_for(:tom) }

  describe 'POST /api/v1/auth/sign_up' do
    # 正常系
    context 'when params is valid' do
      it 'resopnds :ok' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_content_type :json
      end

      it 'renders user data' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to_not be_blank
          expect(data['name']).to eq user_params[:name]
          expect(data['email']).to eq user_params[:email]
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end

      it 'creates a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: user_params }
        }.to change(User, :count).by(1)
      end

      it 'creates session' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(controller.user_signed_in?).to be_truthy
      end

      it 'defines current_user' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        aggregate_failures do
          expect(controller.current_user.name).to eq user_params[:name]
          expect(controller.current_user.email).to eq user_params[:email]
        end
      end
    end

    # 名前がない
    context 'when name is blank' do
      let(:name_blank_params) { attributes_for(:tom, name: '   ') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: name_blank_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: name_blank_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: name_blank_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq '名前を入力してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: name_blank_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: name_blank_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # 名前が長い
    context 'when name is too long' do
      let(:name_too_long_params) { attributes_for(:tom, name: 'a' * 51) }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: name_too_long_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: name_too_long_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: name_too_long_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq '名前は50文字以内で入力してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: name_too_long_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: name_too_long_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # emailが空
    context 'when params[:email] is blank' do
      let(:email_blank_params) { attributes_for(:tom, email: '   ') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: email_blank_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: email_blank_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: email_blank_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'メールアドレスを入力してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: email_blank_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: email_blank_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # emailが長い
    context 'when email is too long' do
      let(:too_long_email_params) { attributes_for(:tom, email: 'a' * 243 + '@bar.com') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: too_long_email_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: too_long_email_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: too_long_email_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'メールアドレスは250文字以内で入力してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: too_long_email_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: too_long_email_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # emailのフォーマットが不正
    context 'when email format is wrong' do
      let(:wrong_format_email_params) { attributes_for(:tom, email: 'foo@bar,co') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: wrong_format_email_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: wrong_format_email_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: wrong_format_email_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'メールアドレスは正しい形式で設定してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: wrong_format_email_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: wrong_format_email_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # emailが既に使われている
    context 'when email has already token' do
      before do
        create(:tom)
      end

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'メールアドレスは既に使用されています'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: user_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # パスワードが空
    context 'when password is blank' do
      let(:password_blank_params) { attributes_for(:tom, password: '   ') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: password_blank_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: password_blank_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: password_blank_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'パスワードを入力してください'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: password_blank_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: password_blank_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # 確認用パスワードがパスワードと一致しない
    context 'when password_confirmation not equal to password' do
      let(:wrong_password_confirmation_params) { attributes_for(:tom, password: 'password', password_confirmation: 'foobar') }

      it 'responds :bad_request' do
        post api_v1_auth_sign_up_path, params: { user: wrong_password_confirmation_params }
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: wrong_password_confirmation_params }
        expect(response).to have_content_type :json
      end

      it 'renders errors' do
        post api_v1_auth_sign_up_path, params: { user: wrong_password_confirmation_params }
        errors = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(errors[0]).to eq 'パスワード（確認用）とパスワードの入力が一致しません'
        end
      end

      it 'does not create a record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: wrong_password_confirmation_params }
        }.to_not change(User, :count)
      end

      it 'does not create sessions' do
        post api_v1_auth_sign_up_path, params: { user: wrong_password_confirmation_params }
        expect(controller.user_signed_in?).to be_falsey
      end
    end

    # ユーザーが既にログインしている
    context 'when user is logged in' do
      before do
        login_as tom
      end

      it 'responds :forbidden' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_http_status :forbidden
      end

      it 'renders json' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        expect(response).to have_content_type :json
      end

      it 'renders message' do
        post api_v1_auth_sign_up_path, params: { user: user_params }
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq 'User has already been logged in.'
      end

      it 'does not create record' do
        expect {
          post api_v1_auth_sign_up_path, params: { user: user_params }
        }.to_not change(User, :count)
      end
    end
  end

  describe 'PATCH /api/v1/auth/registrations' do
    let(:update_user_params) { attributes_for(:user) }

    # 正常系
    context 'when success' do
      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: update_user_params }
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to eq tom.id
          expect(data['name']).to eq update_user_params[:name]
          expect(data['email']).to eq update_user_params[:email]
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end
    end

    # パスワードがからでも更新できる
    context 'when password is blank' do
      let(:user_params) { attributes_for(:user, password: '', password_confirmation: '') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: user_params }
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to eq tom.id
          expect(data['name']).to eq user_params[:name]
          expect(data['email']).to eq user_params[:email]
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end
    end

    # ログインしてない
    context 'when user is not logged in' do
      before do
        patch api_v1_auth_registrations_path, params: { user: update_user_params }
      end

      it 'responds :unauthorized' do
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render message' do
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq 'ログインしてください'
      end
    end

    # 名前が空
    context 'when name is blank' do
      let(:wrong_params) { attributes_for(:user, name: '  ') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq '名前を入力してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # 名前が長すぎる
    context 'when name is too long' do
      let(:wrong_params) { attributes_for(:user, name: 'a' * 51) }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq '名前は50文字以内で入力してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # メールアドレスが空
    context 'when email is blank' do
      let(:wrong_params) { attributes_for(:user, email: '  ') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq 'メールアドレスを入力してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # メールアドレスが長い
    context 'when email is too long' do
      let(:wrong_params) { attributes_for(:user, email: 'a' * 240 + '@example.com') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq 'メールアドレスは250文字以内で入力してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # メールアドレスの形式が正しくない
    context 'when email is wrong format' do
      let(:wrong_params) { attributes_for(:user, email: 'wrong@format,com') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq 'メールアドレスは正しい形式で設定してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # パスワードが短い
    context 'when password is too short' do
      let(:wrong_params) { attributes_for(:user, password: 'foo', password_confirmation: 'foo') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq 'パスワードは6文字以上で入力してください'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end

    # パスワード（確認用）がパスワードと一致しない
    context 'when password_confirmation is wrong' do
      let(:wrong_params) { attributes_for(:user, password_confirmation: 'foobar') }

      before do
        login_as tom
        patch api_v1_auth_registrations_path, params: { user: wrong_params }
      end

      it 'responds :bad_request' do
        expect(response).to have_http_status :bad_request
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders errors messages' do
        err = JSON.parse(response.body)['errors']
        expect(err[0]).to eq 'パスワード（確認用）とパスワードの入力が一致しません'
      end

      it 'does not update record' do
        tom.reload
        aggregate_failures do
          expect(tom.name).to_not eq wrong_params[:name]
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end
    end
  end

  describe 'DELETE /api/v1/auth/registrations' do
    # 正常系
    context 'when success' do
      before do
        login_as tom
      end

      it 'responds :ok' do
        delete api_v1_auth_registrations_path
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        delete api_v1_auth_registrations_path
        expect(response).to have_content_type :json
      end

      it 'renders message' do
        delete api_v1_auth_registrations_path
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq 'アカウントを削除しました'
      end

      it 'destroys a record' do
        expect {
          delete api_v1_auth_registrations_path
        }.to change(User, :count).by(-1)
      end

      it 'destroys sessions' do
        delete api_v1_auth_registrations_path
        expect(controller.user_signed_in?).to be_falsey
      end

      it 'does not define current_user' do
        delete api_v1_auth_registrations_path
        expect(controller.current_user).to be_nil
      end
    end

    # ユーザーがログインしていない
    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        delete api_v1_auth_registrations_path
        expect(response).to have_http_status :unauthorized
      end

      it 'renders json' do
        delete api_v1_auth_registrations_path
        expect(response).to have_content_type :json
      end

      it 'renders message' do
        delete api_v1_auth_registrations_path
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq 'ログインしてください'
      end

      it 'does not destroy record' do
        expect {
          delete api_v1_auth_registrations_path
        }.to_not change(User, :count)
      end
    end
  end
end
