import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_precious_secret_key')
    ADMIN_KEY = os.getenv('ADMIN_SECRET_KEY', 'admin_precious_secret_key')
    DEBUG = False
    CORS_ENABLED = False
    CORS_HEADERS = 'Content-Type'
    SQLALCHEMY_POOL_RECYCLE = 60
    MYSQL_DATABASE_CHARSET = 'utf8mb4'


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_DEV_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG_TB_ENABLED = True
    BCRYPT_LOG_ROUNDS = 4


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL', 'sqlite:///database.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BCRYPT_LOG_ROUNDS = 4
    TOKEN_EXPIRATION_DAYS = 1
    TOKEN_EXPIRATION_SECONDS = 3


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_PROD_URL', 'sqlite:///database.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BCRYPT_LOG_ROUNDS = 4
    TOKEN_EXPIRATION_DAYS = 1
    TOKEN_EXPIRATION_SECONDS = 3


config_by_name = dict(
    development=DevelopmentConfig,
    test=TestingConfig,
    production=ProductionConfig
)

key = Config.SECRET_KEY
admin_key = Config.ADMIN_KEY
