require 'rails_helper'

RSpec.describe "Api::V1::Auth::Sessions", type: :request do
  let(:tom) { create(:tom) }

  describe "POST /api/v1/auth/login" do
    context 'when params is correct' do
      before do
        post api_v1_auth_login_path, params: {
          user: { email: tom.email, password: tom.password }
        }
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to eq tom.id
          expect(data['name']).to eq tom.name
          expect(data['email']).to eq tom.email
          expect(data['created_at']).to_not be_blank
          expect(data['updated_at']).to_not be_blank
          # パスワードなどは表示されないか？
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end

      it 'creates session' do
        expect(controller.user_signed_in?).to be_truthy
      end

      it 'define current_user' do
        expect(controller.current_user).to eq tom
      end
    end

    context 'when email is wrong' do
      before do
        post api_v1_auth_login_path, params: {
          user: { email: 'hogehoge@email.com', password: tom.password }
        }
      end

      it 'responds :not_found' do
        expect(response).to have_http_status :not_found
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render errors' do
        err = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(err['message']).to eq 'アカウントが見つかりませんでした'
        end
      end

      it 'does not create sessions' do
        expect(controller.user_signed_in?).to be_falsey
      end

      it 'does not define current_user' do
        expect(controller.current_user).to be_nil
      end
    end

    context 'when password is wrong' do
      before do
        post api_v1_auth_login_path, params: {
          user: { email: tom.email, password: 'wrong-pass' }
        }
      end

      it 'responds :unauthorized' do
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render errors' do
        err = JSON.parse(response.body)['errors']
        aggregate_failures do
          expect(err['message']).to eq 'アドレスまたはパスワードが違います'
        end
      end

      it 'does not create sessions' do
        expect(controller.user_signed_in?).to be_falsey
      end

      it 'does not define current_user' do
        expect(controller.current_user).to be_nil
      end
    end
  end
end
