--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64)
);


ALTER TABLE public.admin_event_entity OWNER TO admin;

--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO admin;

--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO admin;

--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO admin;

--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO admin;

--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO admin;

--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO admin;

--
-- Name: client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO admin;

--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO admin;

--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO admin;

--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO admin;

--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO admin;

--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO admin;

--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO admin;

--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO admin;

--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO admin;

--
-- Name: client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session (
    id character varying(36) NOT NULL,
    client_id character varying(36),
    redirect_uri character varying(255),
    state character varying(255),
    "timestamp" integer,
    session_id character varying(36),
    auth_method character varying(255),
    realm_id character varying(255),
    auth_user_id character varying(36),
    current_action character varying(36)
);


ALTER TABLE public.client_session OWNER TO admin;

--
-- Name: client_session_auth_status; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_auth_status (
    authenticator character varying(36) NOT NULL,
    status integer,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_auth_status OWNER TO admin;

--
-- Name: client_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_note (
    name character varying(255) NOT NULL,
    value character varying(255),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_note OWNER TO admin;

--
-- Name: client_session_prot_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_prot_mapper (
    protocol_mapper_id character varying(36) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_prot_mapper OWNER TO admin;

--
-- Name: client_session_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_role (
    role_id character varying(255) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_role OWNER TO admin;

--
-- Name: client_user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_user_session_note (
    name character varying(255) NOT NULL,
    value character varying(2048),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_user_session_note OWNER TO admin;

--
-- Name: component; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO admin;

--
-- Name: component_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(4000)
);


ALTER TABLE public.component_config OWNER TO admin;

--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO admin;

--
-- Name: credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.credential OWNER TO admin;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO admin;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO admin;

--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO admin;

--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255)
);


ALTER TABLE public.event_entity OWNER TO admin;

--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024)
);


ALTER TABLE public.fed_user_attribute OWNER TO admin;

--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO admin;

--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO admin;

--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO admin;

--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO admin;

--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO admin;

--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO admin;

--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO admin;

--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO admin;

--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO admin;

--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO admin;

--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL
);


ALTER TABLE public.identity_provider OWNER TO admin;

--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO admin;

--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO admin;

--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO admin;

--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36)
);


ALTER TABLE public.keycloak_group OWNER TO admin;

--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO admin;

--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO admin;

--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL
);


ALTER TABLE public.offline_client_session OWNER TO admin;

--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.offline_user_session OWNER TO admin;

--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO admin;

--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO admin;

--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO admin;

--
-- Name: realm; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO admin;

--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO admin;

--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO admin;

--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO admin;

--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO admin;

--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO admin;

--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO admin;

--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO admin;

--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO admin;

--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO admin;

--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO admin;

--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO admin;

--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO admin;

--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO admin;

--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO admin;

--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode character varying(15) NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO admin;

--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO admin;

--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy character varying(20),
    logic character varying(20),
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO admin;

--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO admin;

--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO admin;

--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO admin;

--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO admin;

--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO admin;

--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO admin;

--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL
);


ALTER TABLE public.user_attribute OWNER TO admin;

--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO admin;

--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO admin;

--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO admin;

--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO admin;

--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO admin;

--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO admin;

--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO admin;

--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO admin;

--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO admin;

--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO admin;

--
-- Name: user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session (
    id character varying(36) NOT NULL,
    auth_method character varying(255),
    ip_address character varying(255),
    last_session_refresh integer,
    login_username character varying(255),
    realm_id character varying(255),
    remember_me boolean DEFAULT false NOT NULL,
    started integer,
    user_id character varying(255),
    user_session_state integer,
    broker_session_id character varying(255),
    broker_user_id character varying(255)
);


ALTER TABLE public.user_session OWNER TO admin;

--
-- Name: user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session_note (
    user_session character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(2048)
);


ALTER TABLE public.user_session_note OWNER TO admin;

--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.username_login_failure (
    realm_id character varying(36) NOT NULL,
    username character varying(255) NOT NULL,
    failed_login_not_before integer,
    last_failure bigint,
    last_ip_failure character varying(255),
    num_failures integer
);


ALTER TABLE public.username_login_failure OWNER TO admin;

--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO admin;

--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
5aa8116c-1002-44f4-a9a6-107a4caa79c7	\N	auth-cookie	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b630a19f-d939-4f94-9676-bba0632193f7	2	10	f	\N	\N
138bcef9-4470-482b-b015-55cc0495bd94	\N	auth-spnego	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b630a19f-d939-4f94-9676-bba0632193f7	3	20	f	\N	\N
4646d66f-97f7-4bcd-9951-a23671051ae9	\N	identity-provider-redirector	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b630a19f-d939-4f94-9676-bba0632193f7	2	25	f	\N	\N
7f2d12af-760e-424a-bf10-8332b1ac990e	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b630a19f-d939-4f94-9676-bba0632193f7	2	30	t	1fea3fc7-6194-46e1-bd4f-fd4067436368	\N
b6c2a552-4e44-44c7-bac0-66e32a4e7ddc	\N	auth-username-password-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	1fea3fc7-6194-46e1-bd4f-fd4067436368	0	10	f	\N	\N
e16bc4d3-b191-4b9e-973d-9fd509a09aed	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	89493031-31f9-4f7a-a209-cc7c204fb338	0	10	f	\N	\N
acc9e9b0-f05a-4195-934b-c181d2ec425a	\N	auth-otp-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	89493031-31f9-4f7a-a209-cc7c204fb338	0	20	f	\N	\N
054490fb-db2e-4c2b-84d9-f047adade536	\N	direct-grant-validate-username	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c0b95f01-4a7e-4cd4-8b39-0ef58c8a07dc	0	10	f	\N	\N
4c89ed8a-6ad4-4a06-8610-d1dcfe566ba9	\N	direct-grant-validate-password	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c0b95f01-4a7e-4cd4-8b39-0ef58c8a07dc	0	20	f	\N	\N
4348901c-4d86-48ac-b41d-118954436789	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c0b95f01-4a7e-4cd4-8b39-0ef58c8a07dc	1	30	t	cd69b4a6-5c6f-469e-afa3-09329bb1b512	\N
7ca9bf36-4c4c-4321-81e4-700eaaa9a017	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd69b4a6-5c6f-469e-afa3-09329bb1b512	0	10	f	\N	\N
04435e9f-b222-41d2-a0f5-d6e8b3d7a762	\N	direct-grant-validate-otp	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd69b4a6-5c6f-469e-afa3-09329bb1b512	0	20	f	\N	\N
58825ee5-9866-4ea7-8d7e-669f79438d5c	\N	registration-page-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	11c84952-061d-43b1-955f-7e9ce822329e	0	10	t	2ea4a817-b8b0-4677-8b78-9f32073082ff	\N
9b78f031-6b7c-4d98-9544-0eff99a3fc72	\N	registration-user-creation	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	2ea4a817-b8b0-4677-8b78-9f32073082ff	0	20	f	\N	\N
3707956d-30f8-4d9b-99f1-a6c3ceeae230	\N	registration-profile-action	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	2ea4a817-b8b0-4677-8b78-9f32073082ff	0	40	f	\N	\N
7146221c-0908-4d61-a137-5309be5d8646	\N	registration-password-action	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	2ea4a817-b8b0-4677-8b78-9f32073082ff	0	50	f	\N	\N
32cb7a02-f096-4033-aa74-6c978ed77d54	\N	registration-recaptcha-action	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	2ea4a817-b8b0-4677-8b78-9f32073082ff	3	60	f	\N	\N
5a8949ff-4308-458f-b896-360f07fb2110	\N	reset-credentials-choose-user	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd5927af-dea9-4014-94ee-6382b0c5e833	0	10	f	\N	\N
42e7ebde-2704-4e34-8ee6-d75fc2d3ad90	\N	reset-credential-email	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd5927af-dea9-4014-94ee-6382b0c5e833	0	20	f	\N	\N
fefa57b8-15f8-42a6-9071-0f581a645aba	\N	reset-password	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd5927af-dea9-4014-94ee-6382b0c5e833	0	30	f	\N	\N
35248792-41c3-487d-8831-24103d395aa5	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd5927af-dea9-4014-94ee-6382b0c5e833	1	40	t	0e85ef82-c275-4721-9f9c-2b6ce69b85a9	\N
a6df0fdf-4506-4885-a924-79fd1c49d498	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0e85ef82-c275-4721-9f9c-2b6ce69b85a9	0	10	f	\N	\N
eb8d1639-8113-4d95-888b-32caf8576d12	\N	reset-otp	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0e85ef82-c275-4721-9f9c-2b6ce69b85a9	0	20	f	\N	\N
dbbb6c24-dfc7-4770-b850-a5cbadfc8c7c	\N	client-secret	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	a26fa438-8541-4fae-b75a-94ad5c9f8fac	2	10	f	\N	\N
9ed38552-4f89-42e9-9506-20eae5dd300d	\N	client-jwt	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	a26fa438-8541-4fae-b75a-94ad5c9f8fac	2	20	f	\N	\N
93a0239b-78a9-4fba-ac1d-e1138a487495	\N	client-secret-jwt	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	a26fa438-8541-4fae-b75a-94ad5c9f8fac	2	30	f	\N	\N
4c004756-2cb1-4cf3-b9a5-b14c03cacca4	\N	client-x509	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	a26fa438-8541-4fae-b75a-94ad5c9f8fac	2	40	f	\N	\N
2a6b416a-6bbe-425e-be13-49b97472682d	\N	idp-review-profile	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	ce590271-0528-4964-9dc7-3d7416af21e5	0	10	f	\N	d8ef1fa2-c000-430d-bfef-43f441b18d57
fb84672d-2aa4-449c-bcbb-c8e6ed204426	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	ce590271-0528-4964-9dc7-3d7416af21e5	0	20	t	b5ff20bc-820c-4973-94a0-76fdf4c37b96	\N
60b831c5-d48d-4b15-a53f-73c4fd9ecd2c	\N	idp-create-user-if-unique	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b5ff20bc-820c-4973-94a0-76fdf4c37b96	2	10	f	\N	a75cf7f0-7028-4237-9a4e-cf5ae327c5e8
5e8ace3a-c832-4232-a9c9-2ee0a59d7d22	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b5ff20bc-820c-4973-94a0-76fdf4c37b96	2	20	t	f5565037-3a8d-434a-9f89-251370448177	\N
25df3393-849b-4db5-a044-9caa0273f444	\N	idp-confirm-link	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f5565037-3a8d-434a-9f89-251370448177	0	10	f	\N	\N
d0205fbc-451f-417f-aac9-1d47a4a64b51	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f5565037-3a8d-434a-9f89-251370448177	0	20	t	783d9d65-fc53-4480-86fd-801710f830f8	\N
3a809a00-1889-4717-a5e7-4d754141a367	\N	idp-email-verification	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	783d9d65-fc53-4480-86fd-801710f830f8	2	10	f	\N	\N
0a0acf0a-b37a-441d-b95f-42fc957b7815	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	783d9d65-fc53-4480-86fd-801710f830f8	2	20	t	91b8a2f2-3618-47b3-8be2-dbefcb79a95b	\N
08a56470-4bc3-4058-b0b3-e2298f859864	\N	idp-username-password-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	91b8a2f2-3618-47b3-8be2-dbefcb79a95b	0	10	f	\N	\N
47e4b3e8-2a0a-4eb6-8c55-9425aed0f1a3	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	91b8a2f2-3618-47b3-8be2-dbefcb79a95b	1	20	t	d33159d0-9531-47e4-bfaa-8bb0a2718b21	\N
a18e31e9-4633-43e1-a9af-7643f4da6ca5	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	d33159d0-9531-47e4-bfaa-8bb0a2718b21	0	10	f	\N	\N
b44e38d7-7fc8-453a-8de8-0957b491c4c2	\N	auth-otp-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	d33159d0-9531-47e4-bfaa-8bb0a2718b21	0	20	f	\N	\N
b8a69f0d-c327-48c5-99a6-48688368fd5e	\N	http-basic-authenticator	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	394b4b5a-bba1-4708-8e4c-6b282bbd9498	0	10	f	\N	\N
ee10e5c0-c2b2-4286-9462-6c130f6bba3c	\N	docker-http-basic-authenticator	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	169a1604-760f-4757-877a-6da73dba941f	0	10	f	\N	\N
3f78536f-6cdf-4010-93c3-b386771fd15e	\N	no-cookie-redirect	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0b583dc9-0c2b-4337-8a41-650a3a0de2d1	0	10	f	\N	\N
4ee8dfb8-093e-4b53-ae19-c28feecd536d	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0b583dc9-0c2b-4337-8a41-650a3a0de2d1	0	20	t	0c00e766-5645-4c7b-9ea1-d5f8559a706f	\N
8132180e-e1cf-442b-8f66-2da5d237b656	\N	basic-auth	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0c00e766-5645-4c7b-9ea1-d5f8559a706f	0	10	f	\N	\N
f4d00ae1-14c4-4934-b094-5e78c7dcdd5c	\N	basic-auth-otp	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0c00e766-5645-4c7b-9ea1-d5f8559a706f	3	20	f	\N	\N
3f16899e-170a-4857-b948-71960a965294	\N	auth-spnego	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0c00e766-5645-4c7b-9ea1-d5f8559a706f	3	30	f	\N	\N
3ed36bf5-8a82-43d3-943a-3fdc67b626c8	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	1fea3fc7-6194-46e1-bd4f-fd4067436368	1	20	t	89493031-31f9-4f7a-a209-cc7c204fb338	\N
55cb724c-9405-4120-a247-4c86dda9855b	\N	auth-cookie	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	21a2e450-dd76-447d-8523-89c08000d1cb	2	10	f	\N	\N
4b62dcae-a13b-47ea-8d5c-db19db4c99b5	\N	auth-spnego	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	21a2e450-dd76-447d-8523-89c08000d1cb	3	20	f	\N	\N
c093e38e-114f-4c81-a5b2-b9f587090233	\N	identity-provider-redirector	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	21a2e450-dd76-447d-8523-89c08000d1cb	2	25	f	\N	\N
1e28578e-7a12-42ee-a78f-48835797f7ba	\N	auth-username-password-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c55f32bc-fc4b-4760-bd05-d8ad871b5226	0	10	f	\N	\N
4681399e-1b83-4197-82d9-0db1ec901ccc	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c55f32bc-fc4b-4760-bd05-d8ad871b5226	1	21	t	042bd23b-0ad8-4139-bd54-9803c2d45164	\N
31fbeed4-bb32-49a5-bb9b-90f72834dfc1	\N	auth-cookie	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	aad3c75b-0a76-479e-8d2e-713dec5d8326	3	10	f	\N	\N
dbe006a0-143c-43fe-acec-67769febc812	\N	conning_license_authenticator	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c55f32bc-fc4b-4760-bd05-d8ad871b5226	0	20	f	\N	\N
d07edd91-c568-4499-a4d4-32f9151fb3b3	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	21a2e450-dd76-447d-8523-89c08000d1cb	0	30	t	c55f32bc-fc4b-4760-bd05-d8ad871b5226	\N
80568e95-6e26-47a0-8746-58e53d249edc	\N	auth-otp-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	042bd23b-0ad8-4139-bd54-9803c2d45164	0	22	f	\N	\N
a01e81c9-694f-4362-b623-beb76a13091d	\N	conditional-user-role	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	042bd23b-0ad8-4139-bd54-9803c2d45164	0	20	f	\N	259e1a99-f8b0-445b-b2ed-ae76c218a27d
828759fd-cd15-4c44-8aa7-eff8437bbbd2	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	042bd23b-0ad8-4139-bd54-9803c2d45164	3	21	f	\N	\N
57a0c878-e9c5-4b30-a294-9a405cdae554	\N	auth-spnego	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	aad3c75b-0a76-479e-8d2e-713dec5d8326	3	20	f	\N	\N
0fa79508-e084-484d-a0ef-7e4901d48729	\N	identity-provider-redirector	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	aad3c75b-0a76-479e-8d2e-713dec5d8326	2	25	f	\N	\N
7f2eb751-f990-429b-8929-3ef99f65c9f5	\N	auth-username-password-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	91bf9ab9-a7d5-4378-8ffe-e508fbd9f87c	0	10	f	\N	\N
af1d9cf8-9c10-4c08-a635-c19156668c7f	\N	conning_license_authenticator	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	91bf9ab9-a7d5-4378-8ffe-e508fbd9f87c	0	20	f	\N	\N
38d9aeb0-bdb8-4fb0-9862-8b15f6f48cec	\N	conditional-user-role	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b81532cf-c1a5-489d-80e5-6322fdb607ae	0	20	f	\N	259e1a99-f8b0-445b-b2ed-ae76c218a27d
8c42d6ae-a866-482a-821b-c6eaf3b8eece	\N	conditional-user-configured	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b81532cf-c1a5-489d-80e5-6322fdb607ae	3	21	f	\N	\N
da5f185a-a9d0-44f5-811c-77db63c1dd9f	\N	auth-otp-form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	b81532cf-c1a5-489d-80e5-6322fdb607ae	0	22	f	\N	\N
2551bf1e-5552-4ea9-9295-1d9d26a50d19	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	91bf9ab9-a7d5-4378-8ffe-e508fbd9f87c	1	21	t	b81532cf-c1a5-489d-80e5-6322fdb607ae	\N
af4c1e7c-fb45-49c8-853a-58faf6a1b818	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	aad3c75b-0a76-479e-8d2e-713dec5d8326	0	30	t	91bf9ab9-a7d5-4378-8ffe-e508fbd9f87c	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
b630a19f-d939-4f94-9676-bba0632193f7	browser	browser based authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
1fea3fc7-6194-46e1-bd4f-fd4067436368	forms	Username, password, otp and other auth forms.	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
89493031-31f9-4f7a-a209-cc7c204fb338	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
c0b95f01-4a7e-4cd4-8b39-0ef58c8a07dc	direct grant	OpenID Connect Resource Owner Grant	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
cd69b4a6-5c6f-469e-afa3-09329bb1b512	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
11c84952-061d-43b1-955f-7e9ce822329e	registration	registration flow	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
2ea4a817-b8b0-4677-8b78-9f32073082ff	registration form	registration form	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	form-flow	f	t
cd5927af-dea9-4014-94ee-6382b0c5e833	reset credentials	Reset credentials for a user if they forgot their password or something	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
0e85ef82-c275-4721-9f9c-2b6ce69b85a9	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
a26fa438-8541-4fae-b75a-94ad5c9f8fac	clients	Base authentication for clients	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	client-flow	t	t
ce590271-0528-4964-9dc7-3d7416af21e5	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
b5ff20bc-820c-4973-94a0-76fdf4c37b96	User creation or linking	Flow for the existing/non-existing user alternatives	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
f5565037-3a8d-434a-9f89-251370448177	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
783d9d65-fc53-4480-86fd-801710f830f8	Account verification options	Method with which to verity the existing account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
91b8a2f2-3618-47b3-8be2-dbefcb79a95b	Verify Existing Account by Re-authentication	Reauthentication of existing account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
d33159d0-9531-47e4-bfaa-8bb0a2718b21	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
394b4b5a-bba1-4708-8e4c-6b282bbd9498	saml ecp	SAML ECP Profile Authentication Flow	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
169a1604-760f-4757-877a-6da73dba941f	docker auth	Used by Docker clients to authenticate against the IDP	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
0b583dc9-0c2b-4337-8a41-650a3a0de2d1	http challenge	An authentication flow based on challenge-response HTTP Authentication Schemes	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	t
0c00e766-5645-4c7b-9ea1-d5f8559a706f	Authentication Options	Authentication options.	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	t
21a2e450-dd76-447d-8523-89c08000d1cb	Conning Browser Authentication Flow	browser based authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	f
c55f32bc-fc4b-4760-bd05-d8ad871b5226	Forms	Username, password, otp and other auth forms.	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	f
042bd23b-0ad8-4139-bd54-9803c2d45164	Conditional OTP	Flow to determine if the OTP is required for the authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	f
aad3c75b-0a76-479e-8d2e-713dec5d8326	Conning CLI Authentication Flow	browser based authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	t	f
b81532cf-c1a5-489d-80e5-6322fdb607ae	Conning CLI Authentication Flow Conditional OTP	Flow to determine if the OTP is required for the authentication	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	f
91bf9ab9-a7d5-4378-8ffe-e508fbd9f87c	Conning CLI Authentication Flow Forms	Username, password, otp and other auth forms.	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	basic-flow	f	f
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
d8ef1fa2-c000-430d-bfef-43f441b18d57	review profile config	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448
a75cf7f0-7028-4237-9a4e-cf5ae327c5e8	create unique user config	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448
259e1a99-f8b0-445b-b2ed-ae76c218a27d	Role check	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
a75cf7f0-7028-4237-9a4e-cf5ae327c5e8	false	require.password.update.after.registration
d8ef1fa2-c000-430d-bfef-43f441b18d57	missing	update.profile.on.first.login
259e1a99-f8b0-445b-b2ed-ae76c218a27d	advise-developer	condUserRole
259e1a99-f8b0-445b-b2ed-ae76c218a27d	true	negate
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	f	master-realm	0	f	\N	\N	t	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
643e067c-0ec7-4a67-9f18-ebc56e284717	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
48e4ac06-720b-4966-9b94-3abe48bee331	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
49d2c6aa-d727-4c48-bb21-7ea4a211510f	t	f	broker	0	f	\N	\N	t	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
fc7ba37a-5682-4821-bf93-80d866a429fd	t	f	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
a94792d7-fc63-47d6-bea5-39c52e9ebce6	t	t	advise-cli	0	t	\N		f		f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	-1	f	f		f	client-secret	https://advise.test		\N	t	f	t	f
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	t	f	admin-cli	0	f	jGgcp6t4EQ6fllWyG1lVRntg17yWjfkc	\N	f	\N	f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	0	f	f	${client_admin-cli}	t	client-secret	\N	\N	\N	f	f	t	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	t	t	advise-spa	0	t	\N		f		f	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	openid-connect	-1	f	f		f	client-secret	https://advise.test		\N	t	f	t	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	acr.loa.map	{}
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	backchannel.logout.revoke.offline.tokens	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	backchannel.logout.session.required	true
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	display.on.consent.screen	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	exclude.session.state.from.auth.response	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	frontchannel.logout.session.required	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	id.token.as.detached.signature	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	oauth2.device.authorization.grant.enabled	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	oidc.ciba.grant.enabled	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	require.pushed.authorization.requests	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.allow.ecp.flow	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.artifact.binding	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.assertion.signature	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.authnstatement	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.client.signature	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.encrypt	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.force.post.binding	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.multivalued.roles	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.onetimeuse.condition	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.server.signature	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml.server.signature.keyinfo.ext	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	saml_force_name_id_format	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	tls.client.certificate.bound.access.tokens	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	token.response.type.bearer.lower-case	false
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	use.refresh.tokens	true
48e4ac06-720b-4966-9b94-3abe48bee331	pkce.code.challenge.method	S256
fc7ba37a-5682-4821-bf93-80d866a429fd	pkce.code.challenge.method	S256
a94792d7-fc63-47d6-bea5-39c52e9ebce6	backchannel.logout.revoke.offline.tokens	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	backchannel.logout.session.required	true
a94792d7-fc63-47d6-bea5-39c52e9ebce6	client.secret.creation.time	1655894720
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.encrypt	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	client_credentials.use_refresh_token	true
a94792d7-fc63-47d6-bea5-39c52e9ebce6	exclude.session.state.from.auth.response	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	frontchannel.logout.session.required	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	id.token.as.detached.signature	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	login_theme	conning
a94792d7-fc63-47d6-bea5-39c52e9ebce6	logoUri	https://advise.test/favicon.ico
a94792d7-fc63-47d6-bea5-39c52e9ebce6	oauth2.device.authorization.grant.enabled	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	oidc.ciba.grant.enabled	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	pkce.code.challenge.method	S256
a94792d7-fc63-47d6-bea5-39c52e9ebce6	post.logout.redirect.uris	+
a94792d7-fc63-47d6-bea5-39c52e9ebce6	require.pushed.authorization.requests	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.allow.ecp.flow	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.artifact.binding	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.assertion.signature	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.client.signature	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.encrypt	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.force.post.binding	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.multivalued.roles	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.server.signature	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.server.signature.keyinfo.ext	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml_force_name_id_format	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	acr.loa.map	{}
a94792d7-fc63-47d6-bea5-39c52e9ebce6	display.on.consent.screen	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.artifact.binding	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.server.signature	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.server.signature.keyinfo.ext	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.assertion.signature	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.client.signature	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.authnstatement	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.onetimeuse.condition	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml_force_name_id_format	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.allow.ecp.flow	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.multivalued.roles	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	saml.force.post.binding	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	exclude.session.state.from.auth.response	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	oauth2.device.authorization.grant.enabled	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	oidc.ciba.grant.enabled	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	use.refresh.tokens	true
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	id.token.as.detached.signature	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	tls.client.certificate.bound.access.tokens	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	require.pushed.authorization.requests	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	client_credentials.use_refresh_token	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	token.response.type.bearer.lower-case	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	display.on.consent.screen	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	backchannel.logout.session.required	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	backchannel.logout.revoke.offline.tokens	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	frontchannel.logout.session.required	false
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	acr.loa.map	{}
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	client.secret.creation.time	1657262023
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	access.token.lifespan	3600
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.authnstatement	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	saml.onetimeuse.condition	false
48e4ac06-720b-4966-9b94-3abe48bee331	post.logout.redirect.uris	+
fc7ba37a-5682-4821-bf93-80d866a429fd	post.logout.redirect.uris	+
643e067c-0ec7-4a67-9f18-ebc56e284717	post.logout.redirect.uris	+
a94792d7-fc63-47d6-bea5-39c52e9ebce6	tls-client-certificate-bound-access-tokens	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	tls.client.certificate.bound.access.tokens	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	token.response.type.bearer.lower-case	false
a94792d7-fc63-47d6-bea5-39c52e9ebce6	use.refresh.tokens	true
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	client.secret.creation.time	1655894720
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	client_credentials.use_refresh_token	true
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	login_theme	conning
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	logoUri	https://advise.test/favicon.ico
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	pkce.code.challenge.method	S256
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	post.logout.redirect.uris	+
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	21a2e450-dd76-447d-8523-89c08000d1cb	browser
a94792d7-fc63-47d6-bea5-39c52e9ebce6	aad3c75b-0a76-479e-8d2e-713dec5d8326	browser
a94792d7-fc63-47d6-bea5-39c52e9ebce6	aad3c75b-0a76-479e-8d2e-713dec5d8326	direct_grant
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
51d7b877-3b05-4f40-a068-c3320a7fe9fa	offline_access	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect built-in scope: offline_access	openid-connect
a613bb56-6e29-4ef5-bf57-957a3647732d	role_list	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	SAML role list	saml
41cc63d1-da17-430a-91c4-f5a80091d386	profile	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect built-in scope: profile	openid-connect
26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	email	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect built-in scope: email	openid-connect
938d724d-2a49-4d6d-ae90-6130591ac1ae	address	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect built-in scope: address	openid-connect
e9e8ba79-40bb-4091-963b-c57684124c58	phone	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect built-in scope: phone	openid-connect
c2206210-3442-4c45-a6e3-025307ad8843	roles	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect scope for add user roles to the access token	openid-connect
d114807e-7d7d-4b2f-87f0-92b14774bca0	web-origins	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect scope for add allowed web origins to the access token	openid-connect
07869d2d-a7e7-4c33-9bd9-2d6998890017	microprofile-jwt	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	Microprofile - JWT built-in scope	openid-connect
5db8427f-4872-44ca-b825-5c17e2fa397c	acr	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
74925d09-8670-4ef7-a7de-79b9a4484a17	userInitialized	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	openid-connect
b0652d1d-23fb-4901-a59b-9f9ba7d4344c	tenant	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	openid-connect
b5330654-1b5d-4fbc-a487-19aa42a0cb3a	permissions	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	openid-connect
9b958831-4789-4cb5-87d1-0fe07d86bb53	lastAccess	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	openid-connect
d8f8e912-6676-44f5-9297-471aa5ccbeaa	new-mapper	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	tenant	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
51d7b877-3b05-4f40-a068-c3320a7fe9fa	true	display.on.consent.screen
51d7b877-3b05-4f40-a068-c3320a7fe9fa	${offlineAccessScopeConsentText}	consent.screen.text
a613bb56-6e29-4ef5-bf57-957a3647732d	true	display.on.consent.screen
a613bb56-6e29-4ef5-bf57-957a3647732d	${samlRoleListScopeConsentText}	consent.screen.text
41cc63d1-da17-430a-91c4-f5a80091d386	true	display.on.consent.screen
41cc63d1-da17-430a-91c4-f5a80091d386	${profileScopeConsentText}	consent.screen.text
41cc63d1-da17-430a-91c4-f5a80091d386	true	include.in.token.scope
26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	true	display.on.consent.screen
26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	${emailScopeConsentText}	consent.screen.text
26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	true	include.in.token.scope
938d724d-2a49-4d6d-ae90-6130591ac1ae	true	display.on.consent.screen
938d724d-2a49-4d6d-ae90-6130591ac1ae	${addressScopeConsentText}	consent.screen.text
938d724d-2a49-4d6d-ae90-6130591ac1ae	true	include.in.token.scope
e9e8ba79-40bb-4091-963b-c57684124c58	true	display.on.consent.screen
e9e8ba79-40bb-4091-963b-c57684124c58	${phoneScopeConsentText}	consent.screen.text
e9e8ba79-40bb-4091-963b-c57684124c58	true	include.in.token.scope
c2206210-3442-4c45-a6e3-025307ad8843	true	display.on.consent.screen
c2206210-3442-4c45-a6e3-025307ad8843	${rolesScopeConsentText}	consent.screen.text
c2206210-3442-4c45-a6e3-025307ad8843	false	include.in.token.scope
d114807e-7d7d-4b2f-87f0-92b14774bca0	false	display.on.consent.screen
d114807e-7d7d-4b2f-87f0-92b14774bca0		consent.screen.text
d114807e-7d7d-4b2f-87f0-92b14774bca0	false	include.in.token.scope
07869d2d-a7e7-4c33-9bd9-2d6998890017	false	display.on.consent.screen
07869d2d-a7e7-4c33-9bd9-2d6998890017	true	include.in.token.scope
5db8427f-4872-44ca-b825-5c17e2fa397c	false	display.on.consent.screen
5db8427f-4872-44ca-b825-5c17e2fa397c	false	include.in.token.scope
74925d09-8670-4ef7-a7de-79b9a4484a17	false	display.on.consent.screen
74925d09-8670-4ef7-a7de-79b9a4484a17	true	include.in.token.scope
b0652d1d-23fb-4901-a59b-9f9ba7d4344c	false	display.on.consent.screen
b0652d1d-23fb-4901-a59b-9f9ba7d4344c	true	include.in.token.scope
b5330654-1b5d-4fbc-a487-19aa42a0cb3a	false	display.on.consent.screen
b5330654-1b5d-4fbc-a487-19aa42a0cb3a	true	include.in.token.scope
9b958831-4789-4cb5-87d1-0fe07d86bb53	true	display.on.consent.screen
9b958831-4789-4cb5-87d1-0fe07d86bb53	true	include.in.token.scope
d8f8e912-6676-44f5-9297-471aa5ccbeaa	true	display.on.consent.screen
d8f8e912-6676-44f5-9297-471aa5ccbeaa	true	include.in.token.scope
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
643e067c-0ec7-4a67-9f18-ebc56e284717	41cc63d1-da17-430a-91c4-f5a80091d386	t
643e067c-0ec7-4a67-9f18-ebc56e284717	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
643e067c-0ec7-4a67-9f18-ebc56e284717	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
643e067c-0ec7-4a67-9f18-ebc56e284717	5db8427f-4872-44ca-b825-5c17e2fa397c	t
643e067c-0ec7-4a67-9f18-ebc56e284717	c2206210-3442-4c45-a6e3-025307ad8843	t
643e067c-0ec7-4a67-9f18-ebc56e284717	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
643e067c-0ec7-4a67-9f18-ebc56e284717	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
643e067c-0ec7-4a67-9f18-ebc56e284717	e9e8ba79-40bb-4091-963b-c57684124c58	f
643e067c-0ec7-4a67-9f18-ebc56e284717	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
48e4ac06-720b-4966-9b94-3abe48bee331	41cc63d1-da17-430a-91c4-f5a80091d386	t
48e4ac06-720b-4966-9b94-3abe48bee331	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
48e4ac06-720b-4966-9b94-3abe48bee331	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
48e4ac06-720b-4966-9b94-3abe48bee331	5db8427f-4872-44ca-b825-5c17e2fa397c	t
48e4ac06-720b-4966-9b94-3abe48bee331	c2206210-3442-4c45-a6e3-025307ad8843	t
48e4ac06-720b-4966-9b94-3abe48bee331	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
48e4ac06-720b-4966-9b94-3abe48bee331	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
48e4ac06-720b-4966-9b94-3abe48bee331	e9e8ba79-40bb-4091-963b-c57684124c58	f
48e4ac06-720b-4966-9b94-3abe48bee331	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	41cc63d1-da17-430a-91c4-f5a80091d386	t
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	5db8427f-4872-44ca-b825-5c17e2fa397c	t
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	c2206210-3442-4c45-a6e3-025307ad8843	t
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	e9e8ba79-40bb-4091-963b-c57684124c58	f
31acfa59-3390-4c5f-ab16-2018ef2d7aa6	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
49d2c6aa-d727-4c48-bb21-7ea4a211510f	41cc63d1-da17-430a-91c4-f5a80091d386	t
49d2c6aa-d727-4c48-bb21-7ea4a211510f	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
49d2c6aa-d727-4c48-bb21-7ea4a211510f	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
49d2c6aa-d727-4c48-bb21-7ea4a211510f	5db8427f-4872-44ca-b825-5c17e2fa397c	t
49d2c6aa-d727-4c48-bb21-7ea4a211510f	c2206210-3442-4c45-a6e3-025307ad8843	t
49d2c6aa-d727-4c48-bb21-7ea4a211510f	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
49d2c6aa-d727-4c48-bb21-7ea4a211510f	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
49d2c6aa-d727-4c48-bb21-7ea4a211510f	e9e8ba79-40bb-4091-963b-c57684124c58	f
49d2c6aa-d727-4c48-bb21-7ea4a211510f	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	41cc63d1-da17-430a-91c4-f5a80091d386	t
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	5db8427f-4872-44ca-b825-5c17e2fa397c	t
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	c2206210-3442-4c45-a6e3-025307ad8843	t
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	e9e8ba79-40bb-4091-963b-c57684124c58	f
cd82e4e8-808b-4897-8d7e-b2431e3b24fa	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
fc7ba37a-5682-4821-bf93-80d866a429fd	41cc63d1-da17-430a-91c4-f5a80091d386	t
fc7ba37a-5682-4821-bf93-80d866a429fd	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
fc7ba37a-5682-4821-bf93-80d866a429fd	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
fc7ba37a-5682-4821-bf93-80d866a429fd	5db8427f-4872-44ca-b825-5c17e2fa397c	t
fc7ba37a-5682-4821-bf93-80d866a429fd	c2206210-3442-4c45-a6e3-025307ad8843	t
fc7ba37a-5682-4821-bf93-80d866a429fd	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
fc7ba37a-5682-4821-bf93-80d866a429fd	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
fc7ba37a-5682-4821-bf93-80d866a429fd	e9e8ba79-40bb-4091-963b-c57684124c58	f
fc7ba37a-5682-4821-bf93-80d866a429fd	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	41cc63d1-da17-430a-91c4-f5a80091d386	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	5db8427f-4872-44ca-b825-5c17e2fa397c	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	c2206210-3442-4c45-a6e3-025307ad8843	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	e9e8ba79-40bb-4091-963b-c57684124c58	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	74925d09-8670-4ef7-a7de-79b9a4484a17	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	b5330654-1b5d-4fbc-a487-19aa42a0cb3a	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	b0652d1d-23fb-4901-a59b-9f9ba7d4344c	t
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	9b958831-4789-4cb5-87d1-0fe07d86bb53	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	5db8427f-4872-44ca-b825-5c17e2fa397c	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	74925d09-8670-4ef7-a7de-79b9a4484a17	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	b5330654-1b5d-4fbc-a487-19aa42a0cb3a	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	41cc63d1-da17-430a-91c4-f5a80091d386	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	c2206210-3442-4c45-a6e3-025307ad8843	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	9b958831-4789-4cb5-87d1-0fe07d86bb53	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	b0652d1d-23fb-4901-a59b-9f9ba7d4344c	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
a94792d7-fc63-47d6-bea5-39c52e9ebce6	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
a94792d7-fc63-47d6-bea5-39c52e9ebce6	e9e8ba79-40bb-4091-963b-c57684124c58	f
a94792d7-fc63-47d6-bea5-39c52e9ebce6	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
a94792d7-fc63-47d6-bea5-39c52e9ebce6	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
51d7b877-3b05-4f40-a068-c3320a7fe9fa	32a19800-d4b9-4d26-b879-085e34933839
e9e8ba79-40bb-4091-963b-c57684124c58	6bd9c56c-9c84-49e6-9f8c-7f9200b64975
\.


--
-- Data for Name: client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session (id, client_id, redirect_uri, state, "timestamp", session_id, auth_method, realm_id, auth_user_id, current_action) FROM stdin;
\.


--
-- Data for Name: client_session_auth_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_auth_status (authenticator, status, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_prot_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_prot_mapper (protocol_mapper_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_role (role_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_user_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
55763c56-03ca-439b-8919-10ac7dbb63af	Trusted Hosts	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
87807c6f-3eea-4cf3-aecf-814da7bc33bc	Consent Required	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
c797cc2f-c091-40ce-9c8d-adc167f8aa68	Full Scope Disabled	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
af863a2e-b3f7-4cb1-a013-bc0a9e956ba8	Max Clients Limit	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
d64372fb-f3b7-46e9-a66f-7d4768bf73e3	Allowed Protocol Mapper Types	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
6dff39bf-7da7-441d-87f4-acf4dacfef68	Allowed Client Scopes	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	anonymous
cc20da25-5f81-4cb1-8384-2e6c42e89313	Allowed Protocol Mapper Types	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	authenticated
dbe647db-d973-46a2-90d8-2472730f6759	Allowed Client Scopes	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	authenticated
a70589dc-8ef7-4318-b8be-fae143d98e82	rsa-generated	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	rsa-generated	org.keycloak.keys.KeyProvider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N
30afcb54-906e-4e32-a4fb-1d3248f863f3	rsa-enc-generated	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	rsa-enc-generated	org.keycloak.keys.KeyProvider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N
759e7b57-7b59-4b4f-bf03-b4b7865e110f	hmac-generated	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	hmac-generated	org.keycloak.keys.KeyProvider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N
0c8b90dc-82c4-44d8-b3f7-f637953cc0fb	aes-generated	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	aes-generated	org.keycloak.keys.KeyProvider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N
6ef73c3d-3e33-4be6-9c33-1dcd5673eb00	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
16d30fb8-992e-4e00-940c-0831d75184af	55763c56-03ca-439b-8919-10ac7dbb63af	host-sending-registration-request-must-match	true
cb3f5ec3-e7f0-4b52-b275-51e398997ba9	55763c56-03ca-439b-8919-10ac7dbb63af	client-uris-must-match	true
b713b5f2-20af-4fdd-aad4-6177fcb8e1e6	af863a2e-b3f7-4cb1-a013-bc0a9e956ba8	max-clients	200
464c0fec-85e2-4fa7-aaff-3c6a6c935068	6dff39bf-7da7-441d-87f4-acf4dacfef68	allow-default-scopes	true
7b119c52-9e75-424e-b005-964789e840b2	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	saml-user-attribute-mapper
d7848949-760e-44c5-98ad-937c8d3b3882	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	saml-user-property-mapper
72fe759b-0464-48e0-8455-226e5b50760f	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	oidc-address-mapper
36a9bbb7-30e6-41dc-b255-7f99d55c8c35	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
bcd2a318-a2ed-42d3-a3a8-acbd9130fdf3	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	oidc-full-name-mapper
85f66e3f-301b-4c9b-97a2-ee4e1836a32f	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	saml-role-list-mapper
16393638-16b3-4ca5-a2c0-a9dcde7409f0	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
57cbd436-c0ed-4234-82fe-3dda82e45e28	cc20da25-5f81-4cb1-8384-2e6c42e89313	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
caad6a2b-e14c-4eee-8cb6-80e33f03db40	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
60821634-1194-4a6c-b3d5-da732d58d000	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
1bc62c64-74eb-4b9f-9e55-11b84a3c432b	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	saml-user-property-mapper
6b53efe8-cac2-4ab4-8e4d-4d1074c1356e	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	oidc-address-mapper
50dc41bb-7e84-45d8-9001-37f3c60b7ed0	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	saml-user-attribute-mapper
8e21b1a5-eba6-4ea6-ad4c-a331b1370aeb	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	oidc-full-name-mapper
29981e2e-1b7b-4fbf-8971-35044ddcc63e	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	saml-role-list-mapper
4b0b9108-b408-4bda-b888-851854f0c43a	d64372fb-f3b7-46e9-a66f-7d4768bf73e3	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
ef6487ed-adf2-45b8-9631-bb35fa012780	dbe647db-d973-46a2-90d8-2472730f6759	allow-default-scopes	true
66a88f43-9e5c-4516-b431-bdbedbea354c	0c8b90dc-82c4-44d8-b3f7-f637953cc0fb	secret	FDg3CBfM-TOB4FDKpBNSzQ
ef26f797-9134-4a9e-9af0-c9b0aa9b9b3b	0c8b90dc-82c4-44d8-b3f7-f637953cc0fb	priority	100
fa63c24a-6417-4bde-b31b-5c8341781a39	0c8b90dc-82c4-44d8-b3f7-f637953cc0fb	kid	9d262d14-211e-405e-ac18-f08095ee3d48
08b08cdb-6e58-4be4-8773-cb8139c6c154	30afcb54-906e-4e32-a4fb-1d3248f863f3	algorithm	RSA-OAEP
bbd9cd62-5763-4e2b-b132-6667f20eeba7	30afcb54-906e-4e32-a4fb-1d3248f863f3	priority	100
e686a3de-ed09-44a6-8d2c-e366f5f0e2dc	30afcb54-906e-4e32-a4fb-1d3248f863f3	privateKey	MIIEogIBAAKCAQEAgvslmuALaOL4aE4/kg/tQw6TvZrnVg/bO4jhKT8Eth1iaBFwlXRgsU8x3vAUHK1hvqlOejFrb2g3NuyLEow6ApEWaulILnsabfPb0Bb5iIqeKetj4C5fsh+dNZ9OOVNBnXI0ZoRxiFyDTj6Fk1StHIn1orncgsw/EG+a0kYsNk1SGL3u8ZTkDI3eQPXvbjAQfKbrvM3dyCajd65BY0A8DwZnciWC3lhlyxkFSjghgernYkBz3WWk6NLP2FnNMbzrVRpoChmR/aTRhPSmPN7Z0sLd1CadkQIB16syPvEVy3weOGAXfou+omXwNCbdL+yibNromzt7JKfLSsUgi+sTAQIDAQABAoIBAG+OCUwr72vIi7sCkeAL0o6fNrNw4ACLhrPg86wWcSPOSQbLe7C+qq+4/Iecv/RgsvQY7K7jslXzU7tioVwNtEaFXat2vjRgQnVNEXTcbHCfZu/a/Hht5rElfdaytIPcZfD72KdLvApgiLC2TTvbDYlV8rBCTg3UeQ29kAXxICyqWkKihvC9lFTmyeRs5GurbtxHSp/2JpCb5FBSxxprhrj7zVu3dpLvQV6AGh89+0eqDCPmyWpduEue+OZXa2dkqC+x6j560dasJ1bzIiBMmo1VA6JRdGBc0CDUG3mNYHhOq53yXmSBlnwRDzmTfBqyO5ClMZXKMmfRSNSc5dKOWjECgYEAy8efgydNKhxrP8OXHbD03HWmbSP2N4VJwr5b90NSVTcA/a1PFEMgFeK5mNLMp2C23ZbUOO2yO87yz2EfjLjJlD/tqSUMRCKNKRws7ENOPrB7EQNf6GEoHDrtyzPdVtHtp2e1CKCGcICA5rTAWne2PyucfElxs7bVdXr03mJ9UxUCgYEApIvGhjrIV8XTMnN81o1mc2F+7b9n74oZ/NLq9dD50Qv99D6C8ImlRlr2Urd92Q1CkaT+V8LhucnQNC0XXAv+0A6XwsS41tc1L2VvPF1cqAWj6e7j5HzKwUHkGxuHf3RUYv1ixR9zXGN5LVCNMHh1sDAeiF/qVR8lzOhgAQAi6z0CgYBHbPnZI55lYz6oQ+skyhCZcVdbK96ySTK4YrajbWJfYf8j62orZPfLFAQPr9tx03FlK+fI6G+vjPMIgzdmwKJPJzUrM0QgYafuv+RzD4hOatdH+FHWhq9jbbhJoC01sDFHmw8WLgXRSwljU/mT/B/R9nxMCAYlgrFBE07e39CjnQKBgGwHhKBN6YiOzbj6z4RBM3kfEmle2AsRXTx68V3QBKO1vtZjUC5CAGtvfvcRlyMwrHrYm0/dF7uVfwcyb3q0OWg5nHN4Gm6avkVO0DgOh62cfmAwwhgZwjgdXXham5wXMOwItZb7rg6DFGSm1Pt0qrew7+rTJhMarwOXsKgXgdV1AoGAIwge0CBGF39unE61F9nk/tFnRyC1Wf80wkFQSBn3OgKTn8ZUPYSWnh0Wzy8pcU96n0YYCkE33bnmodUEAqJrG/Zvifnkzn9GPbs59zUNrqyY5Q8caf/o/e3fWStZkVuTL59O3F9uWhVRcVULPZTAsWe3czv/6ijNa2Y5nFFCrlE=
8c409289-e2a5-405c-aac3-dd5f0c92c2bb	30afcb54-906e-4e32-a4fb-1d3248f863f3	keyUse	ENC
25c37dbd-d4da-479d-8d2d-f18ef55a669d	30afcb54-906e-4e32-a4fb-1d3248f863f3	certificate	MIICmzCCAYMCBgGBgBv0kTANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjIwNjIwMDc1MzQ0WhcNMzIwNjIwMDc1NTI0WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCC+yWa4Ato4vhoTj+SD+1DDpO9mudWD9s7iOEpPwS2HWJoEXCVdGCxTzHe8BQcrWG+qU56MWtvaDc27IsSjDoCkRZq6Uguexpt89vQFvmIip4p62PgLl+yH501n045U0GdcjRmhHGIXINOPoWTVK0cifWiudyCzD8Qb5rSRiw2TVIYve7xlOQMjd5A9e9uMBB8puu8zd3IJqN3rkFjQDwPBmdyJYLeWGXLGQVKOCGB6udiQHPdZaTo0s/YWc0xvOtVGmgKGZH9pNGE9KY83tnSwt3UJp2RAgHXqzI+8RXLfB44YBd+i76iZfA0Jt0v7KJs2uibO3skp8tKxSCL6xMBAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAFUcHZRQnXnEBDgQHGEen5M1PfaHXi6FeU06jGUt0kZtManUzu/CGZhzkQN/uaYLoDMkeXytw+6t4REYlk6Il37auVg7ijLW5Ui7SJDrpj9o3581943Zgr0VRbBTFHmFDD5anw0ELlt6tcV+9N2m9OO1xl6zwUZUXIMrI4PqV1TLnplnl232NS2/BqiDYyjwkASLFKC/0h3CzAnE7ZToSX1UOujhejT1K5kFGeTqdZEd/EkYhHibseJu8uuSlIej6dnQPN7K06Le4Lt3s2eNXFR3qFFGW9n2OMAignKH1JEwIREP50xlbeVJjUP0+UUxI0fPtTGbX1OZuVinSHt4/l8=
2b563808-b146-4093-bac5-045ec758b1fc	759e7b57-7b59-4b4f-bf03-b4b7865e110f	secret	etgKdbyi12Okff788n-dL6_OavaK582TyRrphFSTtBZxVOy4nqdtSoUvA2-hxpMItNq17v0qxPPPQflxaHyOSg
93cd3b13-4df6-464b-8147-90cb16757382	759e7b57-7b59-4b4f-bf03-b4b7865e110f	priority	100
3b575e52-a1d6-4b50-a45f-d444a8c4d528	759e7b57-7b59-4b4f-bf03-b4b7865e110f	algorithm	HS256
992872d6-d9ef-49f7-97e8-3d8e3d89f01a	759e7b57-7b59-4b4f-bf03-b4b7865e110f	kid	93844ffd-bd21-4fb1-8f22-610eebb351da
18383366-99b2-4894-a761-519013927bdf	a70589dc-8ef7-4318-b8be-fae143d98e82	privateKey	MIIEpAIBAAKCAQEAqQfxi6h0URxBmV1mj1mlgId/E6mqQAtJD/qx3Y1mGhGr+5fL4cMmXzwNuWwgRphgji7Tfhi/nC+7+AFLuyMqkeY2mYD6aIeQNA79fsiPgCBUKXqSxKTlB1Pzi0gbhStI4sQ8aOeyzyC2nubYah+QOdBPVxifYkwJIoFx22gMn+CP8Em7LYcxTwpE9acnOFmoj8T2t5dGuOROe1GjdC6y3pDo1Aeby8O60jr0xXKRBeSC4dWDzJ29bHui9Zd5o0XEaQAUt2gHsG3r6EsZw7VAP5has3kkKR8UgXJAd3axhllas3e7CetqlRqXmr99P8JNfHXlfH1hjIwwLuAZYkIzBwIDAQABAoIBAEJt2MPmJDBsRmubhV75AE4O8iYsG7intsMM5zIHDAVaxJhQA9Rp+X6b/1jL4bNc1zWJuZxo5YTgTaMd/0FAhM5qBzM0uTSzcjzDV2SoNZ1JF0pl3aBinY/Psnsej5I6fJ6COKuRw3gbhynT12F9nhTahRPZnWnoL/7bmH992NhLqIb4AeL6HUZT+XHC0iRx16ACi8jDSE+bkjw76+VuyzWYkZjSWnFenVWMAZZGfo2qdf12+pcVbkbuAqeEx8VheNOAg0UvwZ21OHmTgMsCHkCP+FwAFTMx+HL5X00pzy7uZJOVuB3Ta80wYAzb0WAYnG5Du0+QwDw6bLvHxKMfk+ECgYEA5MiR/XZizchxP8gVLuQH7tNL5atYIim4VNvWUNNYIq8GITuzm8ESkzKFl7K8wqlky/HWb4OSkqbOWINc98qxOMVQPryAXofzf9UbOM0nRiOtZf5IFdNLQPeYZZSddlknHx2WnwWkGI96U552xH63RTUA7Q0NcUBCH1k1+tL2gysCgYEAvSOoOiCej8+9UkBA8dstdz4uSMuHxP4jAuNyLVygfIBzh4gRVXGxmuFBcEsLyzgH7ZC6LbWzhwvYsMR0AQJuyx9weWg/k7bSixkSRoTl6JbJblOzh2ebfj+vSqje6b7QJ8Q2ylGxBR/dSAdMW3GMMzBbJutILtPB2KKSJC02EZUCgYEAi0tLB8VyttQZj7nkm94erlxb04QVbwdzwcbvn9ptyQBDfSx6WJSfGJwkFo6uut6kDkA6TT8QmNWSwPWKPxxb9rK7/taKWgPwT56SqmzOQrgqNPUzMoapRO77DK4FiS8S0LEVKdEnbgS9d/f9W/nC4BI7dBkEXDXBjJCmewbDLG0CgYEAhy+HPBS4gF2hGbrnMHbR5lrBRjKDFh/28keTAi0kYBiHeqWcjg+3O9YoqZRaF6QytnAtQiKO8MVc2etwZpBQlEoiYARM/M09a0I+N70hfr7Xtk2JEgzRrMjkB17wBO3nZaTu7Gi7N8hwptzgjLN529SCMi0U6LNd5/M6tTTDYokCgYAQagKbLsPJC/sPS2lXRCeSh4j+Ae+uNQi428XtgQAmW/W1gBGF1RZxuyfWMgM4/ku8tK55b+yndlLpJeNiPcTBEv6WkXLh+KNXpp+cLipAvyWc4XfIQ5LgvYpzkUi2iqnqNyiaEkK7KyZraVjM97ESCAXVhXunCUBl6V4PmfnVDQ==
1039ad7f-f318-4ff4-bb4d-342012a4afb0	a70589dc-8ef7-4318-b8be-fae143d98e82	keyUse	SIG
e2e73712-0939-419c-8f7e-a4c88a256b80	a70589dc-8ef7-4318-b8be-fae143d98e82	priority	100
2e634d08-616b-4f94-806d-9051c2a12b3c	a70589dc-8ef7-4318-b8be-fae143d98e82	certificate	MIICmzCCAYMCBgGBgBv0AzANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjIwNjIwMDc1MzQ0WhcNMzIwNjIwMDc1NTI0WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpB/GLqHRRHEGZXWaPWaWAh38TqapAC0kP+rHdjWYaEav7l8vhwyZfPA25bCBGmGCOLtN+GL+cL7v4AUu7IyqR5jaZgPpoh5A0Dv1+yI+AIFQpepLEpOUHU/OLSBuFK0jixDxo57LPILae5thqH5A50E9XGJ9iTAkigXHbaAyf4I/wSbsthzFPCkT1pyc4WaiPxPa3l0a45E57UaN0LrLekOjUB5vLw7rSOvTFcpEF5ILh1YPMnb1se6L1l3mjRcRpABS3aAewbevoSxnDtUA/mFqzeSQpHxSBckB3drGGWVqzd7sJ62qVGpeav30/wk18deV8fWGMjDAu4BliQjMHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAEWARp8lZ4eb35dMj1D1JLtFTDgg/k8H4HGLIevRxqm51mmGbJ3IH67QsuVXOPr3sSQt9RGW2nHoUo36S6p3E+iSEGujtbsjW7qy27/5n7cPCsuUrrL/xPzgFHYkhyZ5HwIGUjGmT6ZyLQcUtzCJ4fMWvO2w2R6CEqZ9b45eSe2112Ck8iHmrnVBVJ5dRq3REglZjdf6dCrDBSEFU0OhHLUooJeLh2dNSBzQ4aXN9069E4WYCSq7sAIkcTrRTzxDMyggL8Qg5ogR0yxzfeferp9bL528vTeffkTT8VvzziOZWJwNPAbnGgWUpXBfDza9QC4OjeaTElabB6zQ5mlyySk=
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.composite_role (composite, child_role) FROM stdin;
dc974720-fb19-4313-a19e-8fba92f3116c	9117fe37-031d-49bf-a1a1-db932e33c6fb
dc974720-fb19-4313-a19e-8fba92f3116c	a07428c1-adfb-4d1a-8035-9c295a6dae4f
dc974720-fb19-4313-a19e-8fba92f3116c	7bcce37d-f345-4b00-95b7-c1a7b0bc7ff7
dc974720-fb19-4313-a19e-8fba92f3116c	eb13e35b-b9f7-47ae-be94-2474b50a4cc2
dc974720-fb19-4313-a19e-8fba92f3116c	3f8f43c2-adbc-4cdd-a3eb-84611098eab3
dc974720-fb19-4313-a19e-8fba92f3116c	9586dd36-3310-4373-925c-baddffc1308e
dc974720-fb19-4313-a19e-8fba92f3116c	266fc445-0b73-4435-a967-d646ab8cb70f
dc974720-fb19-4313-a19e-8fba92f3116c	7776c48c-88b5-4f03-b5c5-827f77307990
dc974720-fb19-4313-a19e-8fba92f3116c	a4721e5d-2c9a-4cdc-96f4-9b067d8c7e0a
dc974720-fb19-4313-a19e-8fba92f3116c	c0159382-dd9c-4022-bdc8-548c0cdebeb3
dc974720-fb19-4313-a19e-8fba92f3116c	591c0b7f-282d-4cae-a290-14f9451a0af3
dc974720-fb19-4313-a19e-8fba92f3116c	396a4ee8-b65a-4c29-aece-26c5ffe5ab49
dc974720-fb19-4313-a19e-8fba92f3116c	d1243237-f20c-493b-bb19-5ca4ed5f20e6
dc974720-fb19-4313-a19e-8fba92f3116c	dd145db2-b00d-4ecf-b6be-7c86a424de14
dc974720-fb19-4313-a19e-8fba92f3116c	099bfbc5-f821-41fd-bcb8-988f6959a6ea
dc974720-fb19-4313-a19e-8fba92f3116c	92a82c59-f734-4b37-a6c8-89cc5ed98019
dc974720-fb19-4313-a19e-8fba92f3116c	bdc7f12b-61e1-4d01-9f7e-7bfc7ec04ce4
dc974720-fb19-4313-a19e-8fba92f3116c	d071d8bf-fec9-40f4-a487-8388987974e8
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	df4f073d-264f-4f11-9aff-21221c4baac9
3f8f43c2-adbc-4cdd-a3eb-84611098eab3	92a82c59-f734-4b37-a6c8-89cc5ed98019
eb13e35b-b9f7-47ae-be94-2474b50a4cc2	099bfbc5-f821-41fd-bcb8-988f6959a6ea
eb13e35b-b9f7-47ae-be94-2474b50a4cc2	d071d8bf-fec9-40f4-a487-8388987974e8
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	0b4f26d4-02a8-4965-9f41-463318cd282b
0b4f26d4-02a8-4965-9f41-463318cd282b	9d0950a9-60cb-4a6d-b615-cde9cd58148b
00c3dc18-e82b-4640-9fd9-6074556dd578	c4f6462d-ceb1-4928-8f02-6c0bb243e09b
dc974720-fb19-4313-a19e-8fba92f3116c	fa1563e4-6297-41f4-a28c-bed2e673f065
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	32a19800-d4b9-4d26-b879-085e34933839
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	a7f7fa8a-73c6-47bf-8d4f-83cf222f448e
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
452c06bb-ddb3-4f62-b786-896ba1111bd6	\N	password	446e3ca0-f9a1-473d-a618-cb42c82be5fa	1659529057819	My password	{"value":"JdD4to12eSVnlpXy+sD0PzdMM9NFkPb3Rw67z81RjtwaessSt6+XcjnhdBtfHcdbywQqxpUry5iZf1QbWWZYnw==","salt":"uBUDoBGYv5gudu6Fcx3qNw==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
4753385a-22ab-4530-92fb-189c1d509743	\N	password	f7080fd9-388f-4522-898e-e18bf3ec0c9f	1656333225058	\N	{"value":"rvqXTvGqoLwxWSPaFLnez2+T0akkK+7xi/qTEnjkgPQ=","salt":"LbDyDrX3Q7KZxHHzH/2pLw==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
2329f91b-72c6-42e6-a002-b6e1e3f144dd	\N	password	de28cad4-1789-407f-85eb-14f7920537f1	1656335609209	\N	{"value":"9uu3vhflTTEIJOgEtAdCFU30JGmCc71wmq716QCg1/Y=","salt":"J2QjZDk0FhwEZMc7uyzdJA==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
45da01ac-9952-4df9-a242-ba0ab2abc8f4	\N	password	6375901b-9e7e-412c-beda-bdc147267c49	1656333336325	\N	{"value":"I9NYeKYGYDiUFBh3mv3DuB2NFK118rqvc+xB3y8PUuI=","salt":"YBy31Qg145OGpLjHvXLZ2Q==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2022-06-20 07:55:17.221653	1	EXECUTED	8:bda77d94bf90182a1e30c24f1c155ec7	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	5711715847
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2022-06-20 07:55:17.247033	2	MARK_RAN	8:1ecb330f30986693d1cba9ab579fa219	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	5711715847
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2022-06-20 07:55:17.370617	3	EXECUTED	8:cb7ace19bc6d959f305605d255d4c843	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.8.0	\N	\N	5711715847
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2022-06-20 07:55:17.377362	4	EXECUTED	8:80230013e961310e6872e871be424a63	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	5711715847
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2022-06-20 07:55:17.731419	5	EXECUTED	8:67f4c20929126adc0c8e9bf48279d244	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	5711715847
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2022-06-20 07:55:17.739776	6	MARK_RAN	8:7311018b0b8179ce14628ab412bb6783	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	5711715847
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2022-06-20 07:55:18.05242	7	EXECUTED	8:037ba1216c3640f8785ee6b8e7c8e3c1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	5711715847
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2022-06-20 07:55:18.0595	8	MARK_RAN	8:7fe6ffe4af4df289b3157de32c624263	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	5711715847
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2022-06-20 07:55:18.067267	9	EXECUTED	8:9c136bc3187083a98745c7d03bc8a303	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.8.0	\N	\N	5711715847
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2022-06-20 07:55:18.374875	10	EXECUTED	8:b5f09474dca81fb56a97cf5b6553d331	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.8.0	\N	\N	5711715847
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2022-06-20 07:55:18.552443	11	EXECUTED	8:ca924f31bd2a3b219fdcfe78c82dacf4	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5711715847
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2022-06-20 07:55:18.556141	12	MARK_RAN	8:8acad7483e106416bcfa6f3b824a16cd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5711715847
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2022-06-20 07:55:18.584397	13	EXECUTED	8:9b1266d17f4f87c78226f5055408fd5e	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5711715847
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2022-06-20 07:55:18.638113	14	EXECUTED	8:d80ec4ab6dbfe573550ff72396c7e910	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.8.0	\N	\N	5711715847
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2022-06-20 07:55:18.640785	15	MARK_RAN	8:d86eb172171e7c20b9c849b584d147b2	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5711715847
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2022-06-20 07:55:18.643799	16	MARK_RAN	8:5735f46f0fa60689deb0ecdc2a0dea22	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.8.0	\N	\N	5711715847
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2022-06-20 07:55:18.646063	17	EXECUTED	8:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.8.0	\N	\N	5711715847
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2022-06-20 07:55:18.776753	18	EXECUTED	8:5c1a8fd2014ac7fc43b90a700f117b23	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.8.0	\N	\N	5711715847
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2022-06-20 07:55:18.919146	19	EXECUTED	8:1f6c2c2dfc362aff4ed75b3f0ef6b331	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	5711715847
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2022-06-20 07:55:18.929862	20	EXECUTED	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	5711715847
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2022-06-20 07:55:20.297436	45	EXECUTED	8:a164ae073c56ffdbc98a615493609a52	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	5711715847
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2022-06-20 07:55:18.933829	21	MARK_RAN	8:9eb2ee1fa8ad1c5e426421a6f8fdfa6a	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	5711715847
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2022-06-20 07:55:18.949852	22	MARK_RAN	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	5711715847
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2022-06-20 07:55:19.012705	23	EXECUTED	8:d9fa18ffa355320395b86270680dd4fe	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.8.0	\N	\N	5711715847
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2022-06-20 07:55:19.018939	24	EXECUTED	8:90cff506fedb06141ffc1c71c4a1214c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	5711715847
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2022-06-20 07:55:19.021753	25	MARK_RAN	8:11a788aed4961d6d29c427c063af828c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	5711715847
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2022-06-20 07:55:19.113683	26	EXECUTED	8:a4218e51e1faf380518cce2af5d39b43	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.8.0	\N	\N	5711715847
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2022-06-20 07:55:19.377378	27	EXECUTED	8:d9e9a1bfaa644da9952456050f07bbdc	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.8.0	\N	\N	5711715847
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2022-06-20 07:55:19.38433	28	EXECUTED	8:d1bf991a6163c0acbfe664b615314505	update tableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	5711715847
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2022-06-20 07:55:19.613957	29	EXECUTED	8:88a743a1e87ec5e30bf603da68058a8c	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.8.0	\N	\N	5711715847
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2022-06-20 07:55:19.690123	30	EXECUTED	8:c5517863c875d325dea463d00ec26d7a	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.8.0	\N	\N	5711715847
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2022-06-20 07:55:19.735039	31	EXECUTED	8:ada8b4833b74a498f376d7136bc7d327	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.8.0	\N	\N	5711715847
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2022-06-20 07:55:19.741874	32	EXECUTED	8:b9b73c8ea7299457f99fcbb825c263ba	customChange		\N	4.8.0	\N	\N	5711715847
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2022-06-20 07:55:19.748606	33	EXECUTED	8:07724333e625ccfcfc5adc63d57314f3	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5711715847
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2022-06-20 07:55:19.751429	34	MARK_RAN	8:8b6fd445958882efe55deb26fc541a7b	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	5711715847
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2022-06-20 07:55:19.827363	35	EXECUTED	8:29b29cfebfd12600897680147277a9d7	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	5711715847
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2022-06-20 07:55:19.83422	36	EXECUTED	8:73ad77ca8fd0410c7f9f15a471fa52bc	addColumn tableName=REALM		\N	4.8.0	\N	\N	5711715847
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2022-06-20 07:55:19.846489	37	EXECUTED	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5711715847
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2022-06-20 07:55:19.852778	38	EXECUTED	8:27180251182e6c31846c2ddab4bc5781	addColumn tableName=FED_USER_CONSENT		\N	4.8.0	\N	\N	5711715847
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2022-06-20 07:55:19.857876	39	EXECUTED	8:d56f201bfcfa7a1413eb3e9bc02978f9	addColumn tableName=IDENTITY_PROVIDER		\N	4.8.0	\N	\N	5711715847
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2022-06-20 07:55:19.86027	40	MARK_RAN	8:91f5522bf6afdc2077dfab57fbd3455c	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	5711715847
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2022-06-20 07:55:19.863013	41	MARK_RAN	8:0f01b554f256c22caeb7d8aee3a1cdc8	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	5711715847
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2022-06-20 07:55:19.870603	42	EXECUTED	8:ab91cf9cee415867ade0e2df9651a947	customChange		\N	4.8.0	\N	\N	5711715847
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2022-06-20 07:55:20.285517	43	EXECUTED	8:ceac9b1889e97d602caf373eadb0d4b7	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.8.0	\N	\N	5711715847
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2022-06-20 07:55:20.291187	44	EXECUTED	8:84b986e628fe8f7fd8fd3c275c5259f2	addColumn tableName=USER_ENTITY		\N	4.8.0	\N	\N	5711715847
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2022-06-20 07:55:20.30783	46	EXECUTED	8:70a2b4f1f4bd4dbf487114bdb1810e64	customChange		\N	4.8.0	\N	\N	5711715847
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2022-06-20 07:55:20.310541	47	MARK_RAN	8:7be68b71d2f5b94b8df2e824f2860fa2	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	5711715847
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2022-06-20 07:55:20.429938	48	EXECUTED	8:bab7c631093c3861d6cf6144cd944982	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.8.0	\N	\N	5711715847
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2022-06-20 07:55:20.435032	49	EXECUTED	8:fa809ac11877d74d76fe40869916daad	addColumn tableName=REALM		\N	4.8.0	\N	\N	5711715847
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2022-06-20 07:55:20.561017	50	EXECUTED	8:fac23540a40208f5f5e326f6ceb4d291	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.8.0	\N	\N	5711715847
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2022-06-20 07:55:20.64818	51	EXECUTED	8:2612d1b8a97e2b5588c346e817307593	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.8.0	\N	\N	5711715847
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2022-06-20 07:55:20.652267	52	EXECUTED	8:9842f155c5db2206c88bcb5d1046e941	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5711715847
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2022-06-20 07:55:20.656767	53	EXECUTED	8:2e12e06e45498406db72d5b3da5bbc76	update tableName=REALM		\N	4.8.0	\N	\N	5711715847
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2022-06-20 07:55:20.66126	54	EXECUTED	8:33560e7c7989250c40da3abdabdc75a4	update tableName=CLIENT		\N	4.8.0	\N	\N	5711715847
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2022-06-20 07:55:20.680412	55	EXECUTED	8:87a8d8542046817a9107c7eb9cbad1cd	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.8.0	\N	\N	5711715847
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2022-06-20 07:55:20.699521	56	EXECUTED	8:3ea08490a70215ed0088c273d776311e	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.8.0	\N	\N	5711715847
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2022-06-20 07:55:20.766426	57	EXECUTED	8:2d56697c8723d4592ab608ce14b6ed68	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.8.0	\N	\N	5711715847
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2022-06-20 07:55:21.131166	58	EXECUTED	8:3e423e249f6068ea2bbe48bf907f9d86	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.8.0	\N	\N	5711715847
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2022-06-20 07:55:21.207147	59	EXECUTED	8:15cabee5e5df0ff099510a0fc03e4103	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.8.0	\N	\N	5711715847
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2022-06-20 07:55:21.219841	60	EXECUTED	8:4b80200af916ac54d2ffbfc47918ab0e	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	5711715847
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2022-06-20 07:55:21.236594	61	EXECUTED	8:66564cd5e168045d52252c5027485bbb	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.8.0	\N	\N	5711715847
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2022-06-20 07:55:21.247959	62	EXECUTED	8:1c7064fafb030222be2bd16ccf690f6f	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.8.0	\N	\N	5711715847
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2022-06-20 07:55:21.252965	63	EXECUTED	8:2de18a0dce10cdda5c7e65c9b719b6e5	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	5711715847
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2022-06-20 07:55:21.259248	64	EXECUTED	8:03e413dd182dcbd5c57e41c34d0ef682	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	5711715847
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2022-06-20 07:55:21.263513	65	EXECUTED	8:d27b42bb2571c18fbe3fe4e4fb7582a7	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.8.0	\N	\N	5711715847
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2022-06-20 07:55:21.304112	66	EXECUTED	8:698baf84d9fd0027e9192717c2154fb8	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.8.0	\N	\N	5711715847
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2022-06-20 07:55:21.315133	67	EXECUTED	8:ced8822edf0f75ef26eb51582f9a821a	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.8.0	\N	\N	5711715847
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2022-06-20 07:55:21.320369	68	EXECUTED	8:f0abba004cf429e8afc43056df06487d	addColumn tableName=REALM		\N	4.8.0	\N	\N	5711715847
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2022-06-20 07:55:21.342747	69	EXECUTED	8:6662f8b0b611caa359fcf13bf63b4e24	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.8.0	\N	\N	5711715847
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2022-06-20 07:55:21.35119	70	EXECUTED	8:9e6b8009560f684250bdbdf97670d39e	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.8.0	\N	\N	5711715847
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2022-06-20 07:55:21.36182	71	EXECUTED	8:4223f561f3b8dc655846562b57bb502e	addColumn tableName=RESOURCE_SERVER		\N	4.8.0	\N	\N	5711715847
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2022-06-20 07:55:21.376563	72	EXECUTED	8:215a31c398b363ce383a2b301202f29e	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5711715847
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2022-06-20 07:55:21.393425	73	EXECUTED	8:83f7a671792ca98b3cbd3a1a34862d3d	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5711715847
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2022-06-20 07:55:21.395941	74	MARK_RAN	8:f58ad148698cf30707a6efbdf8061aa7	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5711715847
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2022-06-20 07:55:21.458336	75	EXECUTED	8:79e4fd6c6442980e58d52ffc3ee7b19c	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.8.0	\N	\N	5711715847
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2022-06-20 07:55:21.470764	76	EXECUTED	8:87af6a1e6d241ca4b15801d1f86a297d	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.8.0	\N	\N	5711715847
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2022-06-20 07:55:21.478881	77	EXECUTED	8:b44f8d9b7b6ea455305a6d72a200ed15	addColumn tableName=CLIENT		\N	4.8.0	\N	\N	5711715847
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2022-06-20 07:55:21.481341	78	MARK_RAN	8:2d8ed5aaaeffd0cb004c046b4a903ac5	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.8.0	\N	\N	5711715847
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2022-06-20 07:55:21.521211	79	EXECUTED	8:e290c01fcbc275326c511633f6e2acde	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.8.0	\N	\N	5711715847
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2022-06-20 07:55:21.524273	80	MARK_RAN	8:c9db8784c33cea210872ac2d805439f8	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.8.0	\N	\N	5711715847
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2022-06-20 07:55:21.534213	81	EXECUTED	8:95b676ce8fc546a1fcfb4c92fae4add5	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.8.0	\N	\N	5711715847
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2022-06-20 07:55:21.536588	82	MARK_RAN	8:38a6b2a41f5651018b1aca93a41401e5	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5711715847
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2022-06-20 07:55:21.546482	83	EXECUTED	8:3fb99bcad86a0229783123ac52f7609c	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5711715847
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2022-06-20 07:55:21.549189	84	MARK_RAN	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5711715847
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2022-06-20 07:55:21.563261	85	EXECUTED	8:ab4f863f39adafd4c862f7ec01890abc	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	5711715847
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2022-06-20 07:55:21.569791	86	EXECUTED	8:13c419a0eb336e91ee3a3bf8fda6e2a7	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.8.0	\N	\N	5711715847
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2022-06-20 07:55:21.579508	87	EXECUTED	8:e3fb1e698e0471487f51af1ed80fe3ac	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.8.0	\N	\N	5711715847
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2022-06-20 07:55:21.60852	88	EXECUTED	8:babadb686aab7b56562817e60bf0abd0	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.8.0	\N	\N	5711715847
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.61824	89	EXECUTED	8:72d03345fda8e2f17093d08801947773	addColumn tableName=REALM; customChange		\N	4.8.0	\N	\N	5711715847
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.65844	90	EXECUTED	8:61c9233951bd96ffecd9ba75f7d978a4	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.8.0	\N	\N	5711715847
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.671174	91	EXECUTED	8:ea82e6ad945cec250af6372767b25525	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5711715847
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.680383	92	EXECUTED	8:d3f4a33f41d960ddacd7e2ef30d126b3	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.8.0	\N	\N	5711715847
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.682741	93	MARK_RAN	8:1284a27fbd049d65831cb6fc07c8a783	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	5711715847
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.706452	94	EXECUTED	8:9d11b619db2ae27c25853b8a37cd0dea	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	5711715847
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.711382	95	MARK_RAN	8:3002bb3997451bb9e8bac5c5cd8d6327	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.8.0	\N	\N	5711715847
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2022-06-20 07:55:21.723322	96	EXECUTED	8:dfbee0d6237a23ef4ccbb7a4e063c163	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.8.0	\N	\N	5711715847
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.752106	97	EXECUTED	8:75f3e372df18d38c62734eebb986b960	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5711715847
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.754649	98	MARK_RAN	8:7fee73eddf84a6035691512c85637eef	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5711715847
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.788891	99	MARK_RAN	8:7a11134ab12820f999fbf3bb13c3adc8	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5711715847
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.803821	100	EXECUTED	8:c0f6eaac1f3be773ffe54cb5b8482b70	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5711715847
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.806822	101	MARK_RAN	8:18186f0008b86e0f0f49b0c4d0e842ac	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5711715847
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.820813	102	EXECUTED	8:09c2780bcb23b310a7019d217dc7b433	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.8.0	\N	\N	5711715847
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2022-06-20 07:55:21.828032	103	EXECUTED	8:276a44955eab693c970a42880197fff2	customChange		\N	4.8.0	\N	\N	5711715847
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2022-06-20 07:55:21.842422	104	EXECUTED	8:ba8ee3b694d043f2bfc1a1079d0760d7	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.8.0	\N	\N	5711715847
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2022-06-20 07:55:21.85643	105	EXECUTED	8:5e06b1d75f5d17685485e610c2851b17	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.8.0	\N	\N	5711715847
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2022-06-20 07:55:21.871259	106	EXECUTED	8:4b80546c1dc550ac552ee7b24a4ab7c0	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.8.0	\N	\N	5711715847
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2022-07-29 14:40:20.189196	107	EXECUTED	8:af510cd1bb2ab6339c45372f3e491696	customChange		\N	4.8.0	\N	\N	9105617201
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-05-10 07:35:16.984176	108	EXECUTED	8:05c99fc610845ef66ee812b7921af0ef	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.16.1	\N	\N	3704116172
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-05-10 07:35:16.997895	109	MARK_RAN	8:314e803baf2f1ec315b3464e398b8247	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.16.1	\N	\N	3704116172
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-05-10 07:35:17.025652	110	EXECUTED	8:56e4677e7e12556f70b604c573840100	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.16.1	\N	\N	3704116172
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	t	2022-07-29 14:40:14.67856	31611df50c11 (172.18.0.3)
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	51d7b877-3b05-4f40-a068-c3320a7fe9fa	f
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	a613bb56-6e29-4ef5-bf57-957a3647732d	t
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	41cc63d1-da17-430a-91c4-f5a80091d386	t
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1	t
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	938d724d-2a49-4d6d-ae90-6130591ac1ae	f
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	e9e8ba79-40bb-4091-963b-c57684124c58	f
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	c2206210-3442-4c45-a6e3-025307ad8843	t
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	d114807e-7d7d-4b2f-87f0-92b14774bca0	t
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	07869d2d-a7e7-4c33-9bd9-2d6998890017	f
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	5db8427f-4872-44ca-b825-5c17e2fa397c	t
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_group (id, name, parent_group, realm_id) FROM stdin;
3ecedb7a-deb2-40b4-8468-4890866cae1f	advise-developer	 	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	${role_default-roles}	default-roles-master	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
9117fe37-031d-49bf-a1a1-db932e33c6fb	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	${role_create-realm}	create-realm	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
dc974720-fb19-4313-a19e-8fba92f3116c	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	${role_admin}	admin	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
a07428c1-adfb-4d1a-8035-9c295a6dae4f	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_create-client}	create-client	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
7bcce37d-f345-4b00-95b7-c1a7b0bc7ff7	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-realm}	view-realm	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
eb13e35b-b9f7-47ae-be94-2474b50a4cc2	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-users}	view-users	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
3f8f43c2-adbc-4cdd-a3eb-84611098eab3	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-clients}	view-clients	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
9586dd36-3310-4373-925c-baddffc1308e	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-events}	view-events	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
266fc445-0b73-4435-a967-d646ab8cb70f	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-identity-providers}	view-identity-providers	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
7776c48c-88b5-4f03-b5c5-827f77307990	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_view-authorization}	view-authorization	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
a4721e5d-2c9a-4cdc-96f4-9b067d8c7e0a	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-realm}	manage-realm	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
c0159382-dd9c-4022-bdc8-548c0cdebeb3	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-users}	manage-users	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
591c0b7f-282d-4cae-a290-14f9451a0af3	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-clients}	manage-clients	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
396a4ee8-b65a-4c29-aece-26c5ffe5ab49	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-events}	manage-events	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
d1243237-f20c-493b-bb19-5ca4ed5f20e6	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-identity-providers}	manage-identity-providers	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
dd145db2-b00d-4ecf-b6be-7c86a424de14	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_manage-authorization}	manage-authorization	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
099bfbc5-f821-41fd-bcb8-988f6959a6ea	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_query-users}	query-users	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
92a82c59-f734-4b37-a6c8-89cc5ed98019	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_query-clients}	query-clients	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
bdc7f12b-61e1-4d01-9f7e-7bfc7ec04ce4	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_query-realms}	query-realms	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
d071d8bf-fec9-40f4-a487-8388987974e8	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_query-groups}	query-groups	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
df4f073d-264f-4f11-9aff-21221c4baac9	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_view-profile}	view-profile	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
0b4f26d4-02a8-4965-9f41-463318cd282b	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_manage-account}	manage-account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
9d0950a9-60cb-4a6d-b615-cde9cd58148b	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_manage-account-links}	manage-account-links	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
1946049b-b68f-42f0-a8d6-b0f8cecfb977	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_view-applications}	view-applications	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
c4f6462d-ceb1-4928-8f02-6c0bb243e09b	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_view-consent}	view-consent	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
00c3dc18-e82b-4640-9fd9-6074556dd578	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_manage-consent}	manage-consent	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
ae0cc6b1-889c-4a38-8c44-b9e73b3ac4bc	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_delete-account}	delete-account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
02000b0a-8618-4952-b562-e6844b08692e	49d2c6aa-d727-4c48-bb21-7ea4a211510f	t	${role_read-token}	read-token	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	49d2c6aa-d727-4c48-bb21-7ea4a211510f	\N
fa1563e4-6297-41f4-a28c-bed2e673f065	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	t	${role_impersonation}	impersonation	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	\N
32a19800-d4b9-4d26-b879-085e34933839	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	${role_offline-access}	offline_access	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
a7f7fa8a-73c6-47bf-8d4f-83cf222f448e	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	${role_uma_authorization}	uma_authorization	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
6bd9c56c-9c84-49e6-9f8c-7f9200b64975	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	\N	advise-developer	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	\N	\N
8eab66ef-08c1-497e-aec7-7d6e5d650397	643e067c-0ec7-4a67-9f18-ebc56e284717	t	${role_view-groups}	view-groups	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	643e067c-0ec7-4a67-9f18-ebc56e284717	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migration_model (id, version, update_time) FROM stdin;
7ntgd	18.0.0	1655711722
hpeue	19.0.0	1659105621
oa60l	21.0.1	1683704119
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
d078e603-5a9a-441d-b4f0-c53a0b478ee4	audience resolve	openid-connect	oidc-audience-resolve-mapper	48e4ac06-720b-4966-9b94-3abe48bee331	\N
a38f34c3-1106-4830-9307-07ac2b5f1028	locale	openid-connect	oidc-usermodel-attribute-mapper	fc7ba37a-5682-4821-bf93-80d866a429fd	\N
531ada4c-ae77-4b81-a7e2-16984982bfe0	role list	saml	saml-role-list-mapper	\N	a613bb56-6e29-4ef5-bf57-957a3647732d
5a79bc19-a277-4aa1-bae5-08129d63f7e2	full name	openid-connect	oidc-full-name-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
3b5ce89c-cb2d-4916-9850-9100f658c19c	family name	openid-connect	oidc-usermodel-property-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
026a724d-ccf1-4091-b561-ea31b674f1bd	given name	openid-connect	oidc-usermodel-property-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
caa366e1-77cb-4203-8302-adfe1802dd25	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
56fd7c48-48ad-445f-8b72-9e9af97a4af4	username	openid-connect	oidc-usermodel-property-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
01313b06-96dc-4918-a1c8-5959bfe62843	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
60bd17ae-411f-4721-a6fe-932e7a92868b	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
a876f865-9234-41c0-bb55-ec92014aacfc	website	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
4969900e-fa65-45f0-a830-f7ced0ebb83b	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
c0556dc3-d591-4115-8d2b-fe110c396153	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
b20a1078-6a6c-4fce-a18f-988e92b19e86	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	41cc63d1-da17-430a-91c4-f5a80091d386
3ce1e096-a0b2-4461-b804-5ff7d0168a89	email	openid-connect	oidc-usermodel-property-mapper	\N	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	email verified	openid-connect	oidc-usermodel-property-mapper	\N	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1
bdd7f138-33fb-4129-8205-0c507f6d609b	address	openid-connect	oidc-address-mapper	\N	938d724d-2a49-4d6d-ae90-6130591ac1ae
8edc39f3-be84-42f4-a71c-4e3e505930d7	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	e9e8ba79-40bb-4091-963b-c57684124c58
5e52a95e-783f-4317-9dd7-97a6be6e36b0	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	e9e8ba79-40bb-4091-963b-c57684124c58
8b3df73c-6487-41c9-b24e-a2794775a3e4	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	c2206210-3442-4c45-a6e3-025307ad8843
a660273d-966f-47a2-a6f7-f8bc87074812	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	c2206210-3442-4c45-a6e3-025307ad8843
2b528ebe-a9e7-4a77-82ab-6fc55eb45846	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	c2206210-3442-4c45-a6e3-025307ad8843
3009b027-7093-4a80-943e-dd0853da0c40	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	d114807e-7d7d-4b2f-87f0-92b14774bca0
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	upn	openid-connect	oidc-usermodel-property-mapper	\N	07869d2d-a7e7-4c33-9bd9-2d6998890017
2169c255-d038-4e97-a12c-6f9bb3023ae0	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	07869d2d-a7e7-4c33-9bd9-2d6998890017
de397179-818c-44c7-a3e3-8894b62ee8e8	acr loa level	openid-connect	oidc-acr-mapper	\N	5db8427f-4872-44ca-b825-5c17e2fa397c
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	userInitialized	openid-connect	oidc-usermodel-attribute-mapper	\N	74925d09-8670-4ef7-a7de-79b9a4484a17
746fd7bb-3a59-41c2-90f9-362f09e35cbd	https://advise.conning.com/groups	openid-connect	oidc-usermodel-attribute-mapper	\N	b0652d1d-23fb-4901-a59b-9f9ba7d4344c
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	permissions	openid-connect	oidc-usermodel-attribute-mapper	\N	b5330654-1b5d-4fbc-a487-19aa42a0cb3a
3d593067-d422-411b-b10c-f4f1aeff6622	custom-email	openid-connect	oidc-usermodel-property-mapper	\N	26e7467e-9cff-4a1a-88f2-ca30a15ee1b1
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	31acfa59-3390-4c5f-ab16-2018ef2d7aa6	\N
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	31acfa59-3390-4c5f-ab16-2018ef2d7aa6	\N
fab25ea5-34a0-41fe-9e3a-13d6f117033a	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	31acfa59-3390-4c5f-ab16-2018ef2d7aa6	\N
f80b9e77-04ec-4067-a443-cf9540dcfec2	lastAccess	openid-connect	oidc-usersessionmodel-note-mapper	\N	9b958831-4789-4cb5-87d1-0fe07d86bb53
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	https://advise.conning.com/custom.authorization.groups	openid-connect	oidc-usermodel-attribute-mapper	\N	b0652d1d-23fb-4901-a59b-9f9ba7d4344c
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
a38f34c3-1106-4830-9307-07ac2b5f1028	true	userinfo.token.claim
a38f34c3-1106-4830-9307-07ac2b5f1028	locale	user.attribute
a38f34c3-1106-4830-9307-07ac2b5f1028	true	id.token.claim
a38f34c3-1106-4830-9307-07ac2b5f1028	true	access.token.claim
a38f34c3-1106-4830-9307-07ac2b5f1028	locale	claim.name
a38f34c3-1106-4830-9307-07ac2b5f1028	String	jsonType.label
531ada4c-ae77-4b81-a7e2-16984982bfe0	false	single
531ada4c-ae77-4b81-a7e2-16984982bfe0	Basic	attribute.nameformat
531ada4c-ae77-4b81-a7e2-16984982bfe0	Role	attribute.name
01313b06-96dc-4918-a1c8-5959bfe62843	true	userinfo.token.claim
01313b06-96dc-4918-a1c8-5959bfe62843	profile	user.attribute
01313b06-96dc-4918-a1c8-5959bfe62843	true	id.token.claim
01313b06-96dc-4918-a1c8-5959bfe62843	true	access.token.claim
01313b06-96dc-4918-a1c8-5959bfe62843	profile	claim.name
01313b06-96dc-4918-a1c8-5959bfe62843	String	jsonType.label
026a724d-ccf1-4091-b561-ea31b674f1bd	true	userinfo.token.claim
026a724d-ccf1-4091-b561-ea31b674f1bd	firstName	user.attribute
026a724d-ccf1-4091-b561-ea31b674f1bd	true	id.token.claim
026a724d-ccf1-4091-b561-ea31b674f1bd	true	access.token.claim
026a724d-ccf1-4091-b561-ea31b674f1bd	given_name	claim.name
026a724d-ccf1-4091-b561-ea31b674f1bd	String	jsonType.label
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	true	userinfo.token.claim
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	zoneinfo	user.attribute
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	true	id.token.claim
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	true	access.token.claim
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	zoneinfo	claim.name
0dc8cc75-898e-49b0-82ae-241b90d6c7d6	String	jsonType.label
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	true	userinfo.token.claim
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	gender	user.attribute
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	true	id.token.claim
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	true	access.token.claim
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	gender	claim.name
20b195a4-d79f-49a4-b3b3-dd6b481f4d01	String	jsonType.label
3b5ce89c-cb2d-4916-9850-9100f658c19c	true	userinfo.token.claim
3b5ce89c-cb2d-4916-9850-9100f658c19c	lastName	user.attribute
3b5ce89c-cb2d-4916-9850-9100f658c19c	true	id.token.claim
3b5ce89c-cb2d-4916-9850-9100f658c19c	true	access.token.claim
3b5ce89c-cb2d-4916-9850-9100f658c19c	family_name	claim.name
3b5ce89c-cb2d-4916-9850-9100f658c19c	String	jsonType.label
4969900e-fa65-45f0-a830-f7ced0ebb83b	true	userinfo.token.claim
4969900e-fa65-45f0-a830-f7ced0ebb83b	birthdate	user.attribute
4969900e-fa65-45f0-a830-f7ced0ebb83b	true	id.token.claim
4969900e-fa65-45f0-a830-f7ced0ebb83b	true	access.token.claim
4969900e-fa65-45f0-a830-f7ced0ebb83b	birthdate	claim.name
4969900e-fa65-45f0-a830-f7ced0ebb83b	String	jsonType.label
56fd7c48-48ad-445f-8b72-9e9af97a4af4	true	userinfo.token.claim
56fd7c48-48ad-445f-8b72-9e9af97a4af4	username	user.attribute
56fd7c48-48ad-445f-8b72-9e9af97a4af4	true	id.token.claim
56fd7c48-48ad-445f-8b72-9e9af97a4af4	true	access.token.claim
56fd7c48-48ad-445f-8b72-9e9af97a4af4	preferred_username	claim.name
56fd7c48-48ad-445f-8b72-9e9af97a4af4	String	jsonType.label
5a79bc19-a277-4aa1-bae5-08129d63f7e2	true	userinfo.token.claim
5a79bc19-a277-4aa1-bae5-08129d63f7e2	true	id.token.claim
5a79bc19-a277-4aa1-bae5-08129d63f7e2	true	access.token.claim
60bd17ae-411f-4721-a6fe-932e7a92868b	true	userinfo.token.claim
60bd17ae-411f-4721-a6fe-932e7a92868b	picture	user.attribute
60bd17ae-411f-4721-a6fe-932e7a92868b	true	id.token.claim
60bd17ae-411f-4721-a6fe-932e7a92868b	true	access.token.claim
60bd17ae-411f-4721-a6fe-932e7a92868b	picture	claim.name
60bd17ae-411f-4721-a6fe-932e7a92868b	String	jsonType.label
a876f865-9234-41c0-bb55-ec92014aacfc	true	userinfo.token.claim
a876f865-9234-41c0-bb55-ec92014aacfc	website	user.attribute
a876f865-9234-41c0-bb55-ec92014aacfc	true	id.token.claim
a876f865-9234-41c0-bb55-ec92014aacfc	true	access.token.claim
a876f865-9234-41c0-bb55-ec92014aacfc	website	claim.name
a876f865-9234-41c0-bb55-ec92014aacfc	String	jsonType.label
b20a1078-6a6c-4fce-a18f-988e92b19e86	true	userinfo.token.claim
b20a1078-6a6c-4fce-a18f-988e92b19e86	updatedAt	user.attribute
b20a1078-6a6c-4fce-a18f-988e92b19e86	true	id.token.claim
b20a1078-6a6c-4fce-a18f-988e92b19e86	true	access.token.claim
b20a1078-6a6c-4fce-a18f-988e92b19e86	updated_at	claim.name
b20a1078-6a6c-4fce-a18f-988e92b19e86	long	jsonType.label
c0556dc3-d591-4115-8d2b-fe110c396153	true	userinfo.token.claim
c0556dc3-d591-4115-8d2b-fe110c396153	locale	user.attribute
c0556dc3-d591-4115-8d2b-fe110c396153	true	id.token.claim
c0556dc3-d591-4115-8d2b-fe110c396153	true	access.token.claim
c0556dc3-d591-4115-8d2b-fe110c396153	locale	claim.name
c0556dc3-d591-4115-8d2b-fe110c396153	String	jsonType.label
caa366e1-77cb-4203-8302-adfe1802dd25	true	userinfo.token.claim
caa366e1-77cb-4203-8302-adfe1802dd25	nickname	user.attribute
caa366e1-77cb-4203-8302-adfe1802dd25	true	id.token.claim
caa366e1-77cb-4203-8302-adfe1802dd25	true	access.token.claim
caa366e1-77cb-4203-8302-adfe1802dd25	nickname	claim.name
caa366e1-77cb-4203-8302-adfe1802dd25	String	jsonType.label
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	true	userinfo.token.claim
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	middleName	user.attribute
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	true	id.token.claim
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	true	access.token.claim
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	middle_name	claim.name
fa910b8a-e2a6-4146-83b6-101b67c8f4a6	String	jsonType.label
3ce1e096-a0b2-4461-b804-5ff7d0168a89	true	userinfo.token.claim
3ce1e096-a0b2-4461-b804-5ff7d0168a89	email	user.attribute
3ce1e096-a0b2-4461-b804-5ff7d0168a89	true	id.token.claim
3ce1e096-a0b2-4461-b804-5ff7d0168a89	true	access.token.claim
3ce1e096-a0b2-4461-b804-5ff7d0168a89	email	claim.name
3ce1e096-a0b2-4461-b804-5ff7d0168a89	String	jsonType.label
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	true	userinfo.token.claim
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	emailVerified	user.attribute
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	true	id.token.claim
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	true	access.token.claim
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	email_verified	claim.name
41f3a9c9-6bf7-4175-abd4-bd4b3eb00084	boolean	jsonType.label
bdd7f138-33fb-4129-8205-0c507f6d609b	formatted	user.attribute.formatted
bdd7f138-33fb-4129-8205-0c507f6d609b	country	user.attribute.country
bdd7f138-33fb-4129-8205-0c507f6d609b	postal_code	user.attribute.postal_code
bdd7f138-33fb-4129-8205-0c507f6d609b	true	userinfo.token.claim
bdd7f138-33fb-4129-8205-0c507f6d609b	street	user.attribute.street
bdd7f138-33fb-4129-8205-0c507f6d609b	true	id.token.claim
bdd7f138-33fb-4129-8205-0c507f6d609b	region	user.attribute.region
bdd7f138-33fb-4129-8205-0c507f6d609b	true	access.token.claim
bdd7f138-33fb-4129-8205-0c507f6d609b	locality	user.attribute.locality
5e52a95e-783f-4317-9dd7-97a6be6e36b0	true	userinfo.token.claim
5e52a95e-783f-4317-9dd7-97a6be6e36b0	phoneNumberVerified	user.attribute
5e52a95e-783f-4317-9dd7-97a6be6e36b0	true	id.token.claim
5e52a95e-783f-4317-9dd7-97a6be6e36b0	true	access.token.claim
5e52a95e-783f-4317-9dd7-97a6be6e36b0	phone_number_verified	claim.name
5e52a95e-783f-4317-9dd7-97a6be6e36b0	boolean	jsonType.label
8edc39f3-be84-42f4-a71c-4e3e505930d7	true	userinfo.token.claim
8edc39f3-be84-42f4-a71c-4e3e505930d7	phoneNumber	user.attribute
8edc39f3-be84-42f4-a71c-4e3e505930d7	true	id.token.claim
8edc39f3-be84-42f4-a71c-4e3e505930d7	true	access.token.claim
8edc39f3-be84-42f4-a71c-4e3e505930d7	phone_number	claim.name
8edc39f3-be84-42f4-a71c-4e3e505930d7	String	jsonType.label
8b3df73c-6487-41c9-b24e-a2794775a3e4	true	multivalued
8b3df73c-6487-41c9-b24e-a2794775a3e4	foo	user.attribute
8b3df73c-6487-41c9-b24e-a2794775a3e4	true	access.token.claim
8b3df73c-6487-41c9-b24e-a2794775a3e4	realm_access.roles	claim.name
8b3df73c-6487-41c9-b24e-a2794775a3e4	String	jsonType.label
a660273d-966f-47a2-a6f7-f8bc87074812	true	multivalued
a660273d-966f-47a2-a6f7-f8bc87074812	foo	user.attribute
a660273d-966f-47a2-a6f7-f8bc87074812	true	access.token.claim
a660273d-966f-47a2-a6f7-f8bc87074812	resource_access.${client_id}.roles	claim.name
a660273d-966f-47a2-a6f7-f8bc87074812	String	jsonType.label
2169c255-d038-4e97-a12c-6f9bb3023ae0	true	multivalued
2169c255-d038-4e97-a12c-6f9bb3023ae0	foo	user.attribute
2169c255-d038-4e97-a12c-6f9bb3023ae0	true	id.token.claim
2169c255-d038-4e97-a12c-6f9bb3023ae0	true	access.token.claim
2169c255-d038-4e97-a12c-6f9bb3023ae0	groups	claim.name
2169c255-d038-4e97-a12c-6f9bb3023ae0	String	jsonType.label
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	true	userinfo.token.claim
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	username	user.attribute
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	true	id.token.claim
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	true	access.token.claim
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	upn	claim.name
89aedd85-28d9-4fe0-8ec6-59459b33e8cc	String	jsonType.label
de397179-818c-44c7-a3e3-8894b62ee8e8	true	id.token.claim
de397179-818c-44c7-a3e3-8894b62ee8e8	true	access.token.claim
746fd7bb-3a59-41c2-90f9-362f09e35cbd	https://advise\\.conning\\.com/groups	claim.name
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	userInitialized	user.attribute
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	false	id.token.claim
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	true	access.token.claim
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	https://advise\\.conning\\.com/custom.userInitialized	claim.name
746fd7bb-3a59-41c2-90f9-362f09e35cbd	true	multivalued
746fd7bb-3a59-41c2-90f9-362f09e35cbd	tenant	user.attribute
746fd7bb-3a59-41c2-90f9-362f09e35cbd	false	id.token.claim
746fd7bb-3a59-41c2-90f9-362f09e35cbd	true	access.token.claim
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	true	multivalued
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	permission	user.attribute
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	false	id.token.claim
746fd7bb-3a59-41c2-90f9-362f09e35cbd	String	jsonType.label
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	boolean	jsonType.label
e6042d03-7839-426d-8ded-2f8e2fdcbfbf	true	userinfo.token.claim
746fd7bb-3a59-41c2-90f9-362f09e35cbd	true	userinfo.token.claim
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	true	userinfo.token.claim
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	true	access.token.claim
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	https://advise\\.conning\\.com/custom.authorization.permissions	claim.name
e5fe457f-ce2d-4a0b-ad41-078fd53e93a9	String	jsonType.label
3d593067-d422-411b-b10c-f4f1aeff6622	email	user.attribute
3d593067-d422-411b-b10c-f4f1aeff6622	false	id.token.claim
3d593067-d422-411b-b10c-f4f1aeff6622	true	access.token.claim
3d593067-d422-411b-b10c-f4f1aeff6622	https://advise\\.conning\\.com/custom.email	claim.name
3d593067-d422-411b-b10c-f4f1aeff6622	false	userinfo.token.claim
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	clientId	user.session.note
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	true	id.token.claim
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	true	access.token.claim
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	clientId	claim.name
868449c4-9f86-4bcd-a07d-ac7bb2cef43b	String	jsonType.label
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	clientHost	user.session.note
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	true	id.token.claim
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	true	access.token.claim
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	clientHost	claim.name
a0f78436-09ff-4a81-b9bc-5cda57dd7ce8	String	jsonType.label
fab25ea5-34a0-41fe-9e3a-13d6f117033a	clientAddress	user.session.note
fab25ea5-34a0-41fe-9e3a-13d6f117033a	true	id.token.claim
fab25ea5-34a0-41fe-9e3a-13d6f117033a	true	access.token.claim
fab25ea5-34a0-41fe-9e3a-13d6f117033a	clientAddress	claim.name
fab25ea5-34a0-41fe-9e3a-13d6f117033a	String	jsonType.label
f80b9e77-04ec-4067-a443-cf9540dcfec2	lastAccess	user.session.note
f80b9e77-04ec-4067-a443-cf9540dcfec2	false	id.token.claim
f80b9e77-04ec-4067-a443-cf9540dcfec2	true	access.token.claim
f80b9e77-04ec-4067-a443-cf9540dcfec2	lastAccess	claim.name
f80b9e77-04ec-4067-a443-cf9540dcfec2	String	jsonType.label
f80b9e77-04ec-4067-a443-cf9540dcfec2	false	access.tokenResponse.claim
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	true	userinfo.token.claim
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	true	multivalued
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	tenant	user.attribute
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	false	id.token.claim
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	true	access.token.claim
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	https://advise\\.conning\\.com/custom.authorization.groups	claim.name
7d8523a6-dc3a-4cca-bcf8-a1d5b625e758	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	60	300	86400				t	f	0	conning	master	0	\N	f	f	t	f	EXTERNAL	259200	2592000	f	t	cd82e4e8-808b-4897-8d7e-b2431e3b24fa	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	b630a19f-d939-4f94-9676-bba0632193f7	11c84952-061d-43b1-955f-7e9ce822329e	c0b95f01-4a7e-4cd4-8b39-0ef58c8a07dc	cd5927af-dea9-4014-94ee-6382b0c5e833	a26fa438-8541-4fae-b75a-94ad5c9f8fac	2592000	f	900	t	f	169a1604-760f-4757-877a-6da73dba941f	0	f	0	0	0c66404c-4d7f-4c49-9c1e-2244fa8ae483
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
userProfileEnabled	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
displayName	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	Advise
displayNameHtml	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	<div class="kc-logo-text"><span>Advise</span></div>
bruteForceProtected	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
permanentLockout	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
maxFailureWaitSeconds	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	900
minimumQuickLoginWaitSeconds	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	60
waitIncrementSeconds	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	60
quickLoginCheckMilliSeconds	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	1000
maxDeltaTimeSeconds	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	43200
failureFactor	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	30
actionTokenGeneratedByAdminLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	43200
actionTokenGeneratedByUserLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	300
defaultSignatureAlgorithm	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	RS256
oauth2DeviceCodeLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	600
oauth2DevicePollingInterval	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	600
offlineSessionMaxLifespanEnabled	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
offlineSessionMaxLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	5184000
clientOfflineSessionIdleTimeout	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
clientOfflineSessionMaxLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
clientSessionIdleTimeout	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
clientSessionMaxLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
realmReusableOtpCode	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
webAuthnPolicyRpEntityName	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	keycloak
webAuthnPolicySignatureAlgorithms	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	ES256
webAuthnPolicyRpId	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	
webAuthnPolicyAttestationConveyancePreference	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyAuthenticatorAttachment	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyRequireResidentKey	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyUserVerificationRequirement	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyCreateTimeout	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
webAuthnPolicyAvoidSameAuthenticatorRegister	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
webAuthnPolicyRpEntityNamePasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	ES256
webAuthnPolicyRpIdPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	
cibaAuthRequestedUserHint	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	login_hint
webAuthnPolicyAttestationConveyancePreferencePasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyRequireResidentKeyPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	not specified
webAuthnPolicyCreateTimeoutPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	false
client-policies.profiles	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	{"profiles":[]}
client-policies.policies	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	{"policies":[]}
cibaBackchannelTokenDeliveryMode	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	poll
cibaExpiresIn	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	120
cibaInterval	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	5
parRequestUriLifespan	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	60
_browser_header.contentSecurityPolicyReportOnly	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	
_browser_header.xContentTypeOptions	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	nosniff
_browser_header.xRobotsTag	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	none
_browser_header.xFrameOptions	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	SAMEORIGIN
_browser_header.contentSecurityPolicy	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	1; mode=block
_browser_header.strictTransportSecurity	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	max-age=31536000; includeSubDomains
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	BMDgDokernrEA1hfwVMD66PEOBzBhcoEyX7lVYsWlUwH	password
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	true	starttls
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	true	auth
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	2465	port
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	email-smtp.us-east-1.amazonaws.com	host
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	notifications.advise@conning.com	from
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	Advise	fromDisplayName
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	true	ssl
66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	AKIA2XT5BCWMZKMTATMN	user
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.redirect_uris (client_id, value) FROM stdin;
643e067c-0ec7-4a67-9f18-ebc56e284717	/realms/master/account/*
48e4ac06-720b-4966-9b94-3abe48bee331	/realms/master/account/*
fc7ba37a-5682-4821-bf93-80d866a429fd	/admin/master/console/*
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.vfs.cloud9.us-east-1.amazonaws.com/silentCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://advise.test/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://localhost/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.cloud.advise-conning.com/silentAuthCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://localhost:5000/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://a051743227ee111e78d5d0e4476b4a98-436050615.us-east-1.elb.amazonaws.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://localhost:8099/sso-callback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://advise.test/silentAuthCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://webkui.advise-conning.com:8060/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://a5b966aab899d11e7900b0ed00cbc590-1631685228.us-east-1.elb.amazonaws.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://advise.test/*
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://advise.test/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://advise.test/keycloak/realms/master/advise-cli-auth-rest/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.cloud.advise-conning.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://advise.test/lib/keycloak-js/dist/silent-check-sso.html
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://127.0.0.1/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.advise.conning.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.vfs.cloud9.us-east-1.amazonaws.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://*.advise.conning.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://a051743227ee111e78d5d0e4476b4a98-436050615.us-east-1.elb.amazonaws.com/silentAuthCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.advise-conning.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://*.advise-conning.com/silentAuthCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://*.advise-conning.com/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://a5b966aab899d11e7900b0ed00cbc590-1631685228.us-east-1.elb.amazonaws.com/silentAuthCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://*.advise-conning.com:8060/authCallback
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://localhost:9876/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.vfs.cloud9.us-east-1.amazonaws.com/silentCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://advise.test/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://localhost/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.cloud.advise-conning.com/silentAuthCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://localhost:5000/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://a051743227ee111e78d5d0e4476b4a98-436050615.us-east-1.elb.amazonaws.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://localhost:8099/sso-callback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://advise.test/silentAuthCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://webkui.advise-conning.com:8060/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://a5b966aab899d11e7900b0ed00cbc590-1631685228.us-east-1.elb.amazonaws.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://advise.test/*
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://advise.test/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://advise.test/keycloak/realms/master/advise-cli-auth-rest/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.cloud.advise-conning.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://advise.test/lib/keycloak-js/dist/silent-check-sso.html
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://127.0.0.1/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.advise.conning.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.vfs.cloud9.us-east-1.amazonaws.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://*.advise.conning.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://a051743227ee111e78d5d0e4476b4a98-436050615.us-east-1.elb.amazonaws.com/silentAuthCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.advise-conning.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://*.advise-conning.com/silentAuthCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://*.advise-conning.com/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://a5b966aab899d11e7900b0ed00cbc590-1631685228.us-east-1.elb.amazonaws.com/silentAuthCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://*.advise-conning.com:8060/authCallback
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://localhost:9876/authCallback
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
7818e391-2249-4955-a5b1-6b78ef4a5ca4	VERIFY_EMAIL	Verify Email	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	t	f	VERIFY_EMAIL	50
68ab31ea-b288-4ed5-af01-55927cc0f3fa	UPDATE_PROFILE	Update Profile	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	t	f	UPDATE_PROFILE	40
119ee8bd-d7f7-4441-be41-aa513f8f9177	CONFIGURE_TOTP	Configure OTP	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	t	f	CONFIGURE_TOTP	10
46d694da-ed1e-49ce-9f91-8a9e20588a7a	UPDATE_PASSWORD	Update Password	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	t	f	UPDATE_PASSWORD	30
d1227f0a-90bb-4364-8320-f487212847e9	terms_and_conditions	Terms and Conditions	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	f	terms_and_conditions	20
673bdb32-b7c9-4d16-b4ae-8c4d67c8c2ec	update_user_locale	Update User Locale	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	t	f	update_user_locale	1000
c5d921c8-9eb5-411e-89d1-1c8f19b9ef7d	delete_account	Delete Account	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	f	f	delete_account	60
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
48e4ac06-720b-4966-9b94-3abe48bee331	0b4f26d4-02a8-4965-9f41-463318cd282b
48e4ac06-720b-4966-9b94-3abe48bee331	8eab66ef-08c1-497e-aec7-7d6e5d650397
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_attribute (name, value, user_id, id) FROM stdin;
userInitialized	true	de28cad4-1789-407f-85eb-14f7920537f1	b88cd397-2035-4329-9167-dcd94f103c1e
tenant	tenant:test	de28cad4-1789-407f-85eb-14f7920537f1	0b26db0a-7af3-41ad-99ba-4132f0171a99
userInitialized	true	6375901b-9e7e-412c-beda-bdc147267c49	3e08247c-b90e-450e-9e16-8d5faada386e
permission	feature:grw	de28cad4-1789-407f-85eb-14f7920537f1	7d9b6549-25ab-479f-b7c6-df6e9079766f
permission	feature:cra	de28cad4-1789-407f-85eb-14f7920537f1	c2cd02d3-9fd8-4445-a20d-2fd14db7f94b
permission	feature:simulation:firm	de28cad4-1789-407f-85eb-14f7920537f1	6cd9ef17-0d3a-49da-bdbf-643d017dc747
permission	feature:grw	446e3ca0-f9a1-473d-a618-cb42c82be5fa	45488247-556f-438f-9c3b-e649514544c3
permission	feature:cra	446e3ca0-f9a1-473d-a618-cb42c82be5fa	1db0b43f-561b-4e4f-90ac-41bfaa0be09b
permission	feature:gemsDefinitionFile	de28cad4-1789-407f-85eb-14f7920537f1	0ef41899-f599-4e2a-832f-d9da697ec7c6
permission	feature:grw	6375901b-9e7e-412c-beda-bdc147267c49	cfacaf49-704e-4cfa-b764-c2974bce668a
permission	feature:cra	6375901b-9e7e-412c-beda-bdc147267c49	51abf78d-e843-4985-b2f5-d2ae666bf908
permission	feature:simulation:firm	6375901b-9e7e-412c-beda-bdc147267c49	6685b7cd-7406-40e2-aae8-3ba64df27863
permission	feature:gemsDefinitionFile	6375901b-9e7e-412c-beda-bdc147267c49	2edebd2b-cdfc-46fb-aebf-6d1c4c25903e
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
f7080fd9-388f-4522-898e-e18bf3ec0c9f	kenoboe.luck@gmail.com	kenoboe.luck@gmail.com	t	t	\N	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	admin	1655711725259	\N	0
71c35206-e351-40a4-b961-f30412fb6d7b	\N	5c024725-ed57-4e57-b79f-52dcc190074d	f	t	\N	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	service-account-admin-cli	1657262023486	31acfa59-3390-4c5f-ab16-2018ef2d7aa6	0
6375901b-9e7e-412c-beda-bdc147267c49	kent.chen@conning.com	kent.chen@conning.com	t	t	\N	\N	\N	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	kent.chen	1655713579968	\N	0
de28cad4-1789-407f-85eb-14f7920537f1	tenant.tester@conning.com	tenant.tester@conning.com	t	t	\N	Tenant	Tester	66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	tenant.tester	1656335470048	\N	0
446e3ca0-f9a1-473d-a618-cb42c82be5fa	webvisetester@conning.com	webvisetester@conning.com	t	t	\N			66807b96-40a2-4fdc-9fd0-e2d8aa0e9448	webvise.tester	1659528995739	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_group_membership (group_id, user_id) FROM stdin;
3ecedb7a-deb2-40b4-8468-4890866cae1f	6375901b-9e7e-412c-beda-bdc147267c49
3ecedb7a-deb2-40b4-8468-4890866cae1f	de28cad4-1789-407f-85eb-14f7920537f1
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	f7080fd9-388f-4522-898e-e18bf3ec0c9f
dc974720-fb19-4313-a19e-8fba92f3116c	f7080fd9-388f-4522-898e-e18bf3ec0c9f
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	6375901b-9e7e-412c-beda-bdc147267c49
6bd9c56c-9c84-49e6-9f8c-7f9200b64975	6375901b-9e7e-412c-beda-bdc147267c49
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	de28cad4-1789-407f-85eb-14f7920537f1
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	71c35206-e351-40a4-b961-f30412fb6d7b
099bfbc5-f821-41fd-bcb8-988f6959a6ea	71c35206-e351-40a4-b961-f30412fb6d7b
c0159382-dd9c-4022-bdc8-548c0cdebeb3	71c35206-e351-40a4-b961-f30412fb6d7b
eb13e35b-b9f7-47ae-be94-2474b50a4cc2	71c35206-e351-40a4-b961-f30412fb6d7b
6bd9c56c-9c84-49e6-9f8c-7f9200b64975	f7080fd9-388f-4522-898e-e18bf3ec0c9f
6bd9c56c-9c84-49e6-9f8c-7f9200b64975	de28cad4-1789-407f-85eb-14f7920537f1
0c66404c-4d7f-4c49-9c1e-2244fa8ae483	446e3ca0-f9a1-473d-a618-cb42c82be5fa
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session (id, auth_method, ip_address, last_session_refresh, login_username, realm_id, remember_me, started, user_id, user_session_state, broker_session_id, broker_user_id) FROM stdin;
\.


--
-- Data for Name: user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session_note (user_session, name, value) FROM stdin;
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.web_origins (client_id, value) FROM stdin;
fc7ba37a-5682-4821-bf93-80d866a429fd	+
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	https://advise.test
bd57ec1b-17bc-46f9-b92c-df8a5d12b448	http://localhost:5000
a94792d7-fc63-47d6-bea5-39c52e9ebce6	https://advise.test
a94792d7-fc63-47d6-bea5-39c52e9ebce6	http://localhost:5000
\.


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: client_user_session_note constr_cl_usr_ses_note; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT constr_cl_usr_ses_note PRIMARY KEY (client_session, name);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: client_session_role constraint_5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT constraint_5 PRIMARY KEY (client_session, role_id);


--
-- Name: user_session constraint_57; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT constraint_57 PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client_session_note constraint_5e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT constraint_5e PRIMARY KEY (client_session, name);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: client_session constraint_8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT constraint_8 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: client_session_auth_status constraint_auth_status_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT constraint_auth_status_pk PRIMARY KEY (client_session, authenticator);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: client_session_prot_mapper constraint_cs_pmp_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT constraint_cs_pmp_pk PRIMARY KEY (client_session, protocol_mapper_id);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_session_note constraint_usn_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT constraint_usn_pk PRIMARY KEY (user_session, name);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_jkuwuvd56ontgsuhogm8uewrt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_jkuwuvd56ontgsuhogm8uewrt UNIQUE (client_id, client_storage_provider, external_client_id, user_id);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_client_session_session; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_session_session ON public.client_session USING btree (session_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_css_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_css_preload ON public.offline_client_session USING btree (client_id, offline_flag);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_offline_uss_by_usersess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_usersess ON public.offline_user_session USING btree (realm_id, offline_flag, user_session_id);


--
-- Name: idx_offline_uss_createdon; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_createdon ON public.offline_user_session USING btree (created_on);


--
-- Name: idx_offline_uss_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_preload ON public.offline_user_session USING btree (offline_flag, created_on, user_session_id);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_us_sess_id_on_cl_sess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_us_sess_id_on_cl_sess ON public.offline_client_session USING btree (user_session_id);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: client_session_auth_status auth_status_constraint; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT auth_status_constraint FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_session_note fk5edfb00ff51c2736; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT fk5edfb00ff51c2736 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: user_session_note fk5edfb00ff51d3472; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT fk5edfb00ff51d3472 FOREIGN KEY (user_session) REFERENCES public.user_session(id);


--
-- Name: client_session_role fk_11b7sgqw18i532811v7o2dv76; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT fk_11b7sgqw18i532811v7o2dv76 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session_prot_mapper fk_33a8sgqw18i532811v7o2dk89; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT fk_33a8sgqw18i532811v7o2dk89 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session fk_b4ao2vcvat6ukau74wbwtfqo1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT fk_b4ao2vcvat6ukau74wbwtfqo1 FOREIGN KEY (session_id) REFERENCES public.user_session(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_user_session_note fk_cl_usr_ses_note; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT fk_cl_usr_ses_note FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

